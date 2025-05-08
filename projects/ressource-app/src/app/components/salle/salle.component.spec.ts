import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalleComponent } from './salle.component';
import { SalleService } from '../../services/salle.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';

describe('SalleComponent', () => {
  let component: SalleComponent;
  let fixture: ComponentFixture<SalleComponent>;
  let salleService: jasmine.SpyObj<SalleService>;

  beforeEach(async () => {
    const salleServiceSpy = jasmine.createSpyObj('SalleService', ['getSalles', 'createSalle', 'updateSalle', 'deleteSalle']);

    await TestBed.configureTestingModule({
      declarations: [ SalleComponent ],
      providers: [
        { provide: SalleService, useValue: salleServiceSpy },
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SalleComponent);
    component = fixture.componentInstance;
    salleService = TestBed.inject(SalleService) as jasmine.SpyObj<SalleService>;
  });

  it('should load salles on init', () => {
    const mockSalles = [{ id: 1, nom: 'Room A', capacite: 20 }];
    salleService.getSalles.and.returnValue(of({ content: mockSalles }));

    component.ngOnInit();

    expect(component.salles).toEqual(mockSalles);
    expect(salleService.getSalles).toHaveBeenCalled();
  });

  it('should create a new salle', () => {
    component.salle = { nom: 'New Room', capacite: 30 };
    salleService.createSalle.and.returnValue(of({}));

    component.saveSalle();

    expect(salleService.createSalle).toHaveBeenCalledWith(component.salle);
  });

  it('should delete a salle', () => {
    const salleToDelete = { id: 1, nom: 'Room A', capacite: 20 }; // Include capacite here
    component.salles = [salleToDelete];
    salleService.deleteSalle.and.returnValue(of({}));

    component.deleteSalle(salleToDelete);

    expect(component.salles).not.toContain(salleToDelete);
    expect(salleService.deleteSalle).toHaveBeenCalledWith(salleToDelete.id);
  });
});