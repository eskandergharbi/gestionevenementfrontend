import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnouncementComponent } from './announcement.component';
import { of } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { AnnouncementService } from '../../../../services/annoucement.service';

describe('AnnouncementComponent', () => {
  let component: AnnouncementComponent;
  let fixture: ComponentFixture<AnnouncementComponent>;
  let service: jasmine.SpyObj<AnnouncementService>;

  const mockAnnouncements = [
    { id: 1, title: 'Title 1', content: 'Content 1' },
    { id: 2, title: 'Title 2', content: 'Content 2' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AnnouncementService', [
      'getAll', 'postAnnouncement', 'updateAnnouncement', 'deleteAnnouncement'
    ]);

    await TestBed.configureTestingModule({
      declarations: [AnnouncementComponent],
      imports: [FormsModule],
      providers: [
        { provide: AnnouncementService, useValue: spy },
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();

    service = TestBed.inject(AnnouncementService) as jasmine.SpyObj<AnnouncementService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementComponent);
    component = fixture.componentInstance;
    service.getAll.and.returnValue(of(mockAnnouncements));
    fixture.detectChanges();
  });

  it('should fetch all announcements on init', () => {
    expect(service.getAll).toHaveBeenCalled();
    expect(component.announcements.length).toBe(2);
  });

  it('should call postAnnouncement when sending new', () => {
    component.announcement = { title: 'New', content: 'Something' };
    service.postAnnouncement.and.returnValue(of());

    component.sendAnnouncement();

    expect(service.postAnnouncement).toHaveBeenCalledWith(component.announcement);
  });

  it('should call updateAnnouncement in edit mode', () => {
    component.announcement = { id: 1, title: 'Updated', content: 'Updated content' };
    component.editMode = true;
    service.updateAnnouncement.and.returnValue(of());

    component.updateAnnouncement();

    expect(service.updateAnnouncement).toHaveBeenCalledWith(1, component.announcement);
  });

  it('should call deleteAnnouncement when confirming deletion', () => {
    const ann = { id: 1, title: 'T', content: 'C' };
    service.deleteAnnouncement.and.returnValue(of());

    component.confirmDelete(ann); // this normally triggers a PrimeNG dialog

    // simulate confirmation call manually if needed
    component.deleteAnnouncement(ann.id);

    expect(service.deleteAnnouncement).toHaveBeenCalledWith(ann.id);
  });
});
