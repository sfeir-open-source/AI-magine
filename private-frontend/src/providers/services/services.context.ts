import {createContext} from "react";
import {ServiceContextType} from "@/src/providers/services/services.types";

export const ServicesContext = createContext<ServiceContextType>({
    sfeirEventsService: undefined
})
