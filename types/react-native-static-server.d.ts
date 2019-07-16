declare module "react-native-static-server" {
    type StaticServerOptions = {
        localOnly?: boolean;
        keepAlive?: boolean;
    }
    class StaticServer {
        constructor();
        constructor(port: number);
        constructor(opts: StaticServerOptions);
        constructor(port:number, opts: StaticServerOptions);
        constructor(port:number, path: string);
        constructor(port: number, path: string, opts: StaticServerOptions);
        start(): Promise<string>;
        stop(): Promise<void>;
    }
    export = StaticServer;
}