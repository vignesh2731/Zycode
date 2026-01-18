export class WebSocketSingleton{
    public static instance: WebSocket | null = null;
    private client: WebSocket| null = null;
    static getInstance(userId:number,contestId:string){
        if(!WebSocketSingleton.instance){
            this.instance = new WebSocket('ws://localhost:8080');
            this.instance.onopen = ()=>{
                this.instance?.send(JSON.stringify({
                    type: 'init',
                    contestId: contestId,
                    userId:userId
                }))
            }
        }
        return this.instance;
    }
}

