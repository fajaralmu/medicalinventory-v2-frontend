import { injectable } from "inversify";
import LoadingContainer from "../LoadingContainer";

@injectable()
export default class LoadingService {
    private container: LoadingContainer | undefined;

    setContainer = (c: LoadingContainer) => this.container = c;
    start = (realtime = false) => {
        this.container?.start(realtime);
    }
    stop = () => {
        this.container?.stop();
    }
}