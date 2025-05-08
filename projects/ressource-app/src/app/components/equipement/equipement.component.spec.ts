import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipementComponent } from './equipement.component';
import { EquipementService } from '../../services/equipement.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';

describe('EquipementComponent', () => {
  let component: EquipementComponent;
  let fixture: ComponentFixture<EquipementComponent>;
  let equipementService: jasmine.SpyObj<EquipementService>;

  beforeEach(async () => {
    const equipementServiceSpy = jasmine.createSpyObj('EquipementService', ['getEquipements', 'createEquipement', 'updateEquipement', 'deleteEquipement']);

    await TestBed.configureTestingModule({
      declarations: [ EquipementComponent ],
      providers: [
        { provide: EquipementService, useValue: equipementServiceSpy },
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EquipementComponent);
    component = fixture.componentInstance;
    equipementService = TestBed.inject(EquipementService) as jasmine.SpyObj<EquipementService>;
  });

  it('should load equipements on init', () => {
    const mockEquipements = [{ id: 1, nom: 'Projector', quantite: 5 }];
    equipementService.getEquipements.and.returnValue(of({ content: mockEquipements }));

    component.ngOnInit();

    expect(component.equipements).toEqual(mockEquipements);
    expect(equipementService.getEquipements).toHaveBeenCalled();
  });

  it('should create a new equipement', () => {
    component.equipement = { nom: 'New Equipement', quantite: 10 };
    equipementService.createEquipement.and.returnValue(of({}));

    component.saveEquipement();

    expect(equipementService.createEquipement).toHaveBeenCalledWith(component.equipement);
  });

  it('should delete an equipement', () => {
    const equipementToDelete = { id: 1, nom: 'Projector', quantite: 5 };
    component.equipements = [equipementToDelete];
    equipementService.deleteEquipement.and.returnValue(of({}));

    component.deleteEquipement(equipementToDelete);

    expect(component.equipements).not.toContain(equipementToDelete);
    expect(equipementService.deleteEquipement).toHaveBeenCalledWith(equipementToDelete.id);
  });
});