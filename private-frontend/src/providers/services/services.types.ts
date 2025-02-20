import {SfeirEventService} from "@/src/services/sfeir-event/sfeir-event.service";

export type ServiceContextType = {
    sfeirEventsService?: SfeirEventService
};

export type  ServiceProviderProps = {
    sfeirEventsService: SfeirEventService
}
