import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EventCountListComponent } from './event-count-list.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';

describe('EventCountListComponent', () => {
  let component: EventCountListComponent;
  let fixture: ComponentFixture<EventCountListComponent>;
  let httpMock: HttpTestingController;

  const mockData = [
    { eventId: 'E1', participantCount: 25 },
    { eventId: 'E2', participantCount: 40 }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CardModule,
        ProgressBarModule,
        EventCountListComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCountListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch events and set default capacity', () => {
    const req = httpMock.expectOne('http://localhost:8101/api/registrations/participants');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    fixture.detectChanges();

    expect(component.events.length).toBe(2);
    expect(component.events[0].eventId).toBe('E1');
    expect(component.events[0].capacite).toBe(50); // capacité par défaut
  });

  it('should correctly calculate participation rate', () => {
    const taux = component.calculateTaux({ eventId: 'E1', participantCount: 25, capacite: 50 });
    expect(taux).toBe(50);
  });

  it('should return 0 if capacite is 0 or undefined', () => {
    expect(component.calculateTaux({ eventId: 'X', participantCount: 10, capacite: 0 })).toBe(0);
    expect(component.calculateTaux({ eventId: 'Y', participantCount: 10 })).toBe(0);
  });
});
