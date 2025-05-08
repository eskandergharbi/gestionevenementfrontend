import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationComponent } from './reservation.component';
import { ReservationService } from '../../services/reservation.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';

describe('ReservationComponent', () => {
  let component: ReservationComponent;
  let fixture: ComponentFixture<ReservationComponent>;
  let reservationService: jasmine.SpyObj<ReservationService>;

  beforeEach(async () => {
    const reservationServiceSpy = jasmine.createSpyObj('ReservationService', ['getReservations', 'createReservation', 'updateReservation', 'deleteReservation']);

    await TestBed.configureTestingModule({
      declarations: [ ReservationComponent ],
      providers: [
        { provide: ReservationService, useValue: reservationServiceSpy },
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationComponent);
    component = fixture.componentInstance;
    reservationService = TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>;
  });

  it('should load reservations on init', () => {
    const mockReservations = [{ id: 1, idescription: 'Meeting', startTime: new Date(), endTime: new Date() }];
    reservationService.getReservations.and.returnValue(of({ content: mockReservations }));

    component.ngOnInit();

    expect(component.reservations).toEqual(mockReservations);
    expect(reservationService.getReservations).toHaveBeenCalled();
  });

  it('should create a new reservation', () => {
    component.reservation = { idescription: 'New Reservation', startTime: new Date(), endTime: new Date() };
    reservationService.createReservation.and.returnValue(of({}));

    component.saveReservation();

    expect(reservationService.createReservation).toHaveBeenCalledWith(component.reservation);
  });

  it('should delete a reservation', () => {
    const reservationToDelete = { id: 1, idescription: 'Meeting' };
    component.reservations = [reservationToDelete];
    reservationService.deleteReservation.and.returnValue(of({}));

    component.deleteReservation(reservationToDelete);

    expect(component.reservations).not.toContain(reservationToDelete);
    expect(reservationService.deleteReservation).toHaveBeenCalledWith(reservationToDelete.id);
  });
});