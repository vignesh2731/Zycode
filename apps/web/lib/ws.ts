export class WebSocketSingleton{
    public static instance: WebSocket | null = null;
    private static initData: { userId: number; contestId: string } | null = null;
    
    static getInstance(userId:number, contestId:string): WebSocket {
        // Get WebSocket URL from environment or use default
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
        
        // If no instance exists or socket is closed, create a new one
        if(!WebSocketSingleton.instance || WebSocketSingleton.instance.readyState === WebSocket.CLOSED){
            console.log("Created new WebSocket connecting to:", wsUrl);
            WebSocketSingleton.instance = new WebSocket(wsUrl);
            WebSocketSingleton.initData = { userId, contestId };
            
            WebSocketSingleton.instance.onopen = () => {
                console.log("WebSocket connection opened");
                if(WebSocketSingleton.instance && WebSocketSingleton.initData){
                    WebSocketSingleton.instance.send(JSON.stringify({
                        type: 'init',
                        contestId: WebSocketSingleton.initData.contestId,
                        userId: WebSocketSingleton.initData.userId
                    }));
                }
            };

            WebSocketSingleton.instance.onerror = (error) => {
                console.error("WebSocket error:", error);
                console.error("WebSocket failed to connect. Is the WSS server running on ws://localhost:8080?");
            };

            WebSocketSingleton.instance.onclose = (event) => {
                console.log("WebSocket connection closed", event.code, event.reason);
                WebSocketSingleton.instance = null;
                WebSocketSingleton.initData = null;
            };
        } else if(WebSocketSingleton.instance.readyState === WebSocket.OPEN){
            // If socket is already open, always send init to ensure server has latest data
            const currentUserId = WebSocketSingleton.initData?.userId;
            const currentContestId = WebSocketSingleton.initData?.contestId;
            if(currentUserId !== userId || currentContestId !== contestId || !WebSocketSingleton.initData){
                console.log("Updating WebSocket init data and sending init message");
                WebSocketSingleton.initData = { userId, contestId };
                WebSocketSingleton.instance.send(JSON.stringify({
                    type: 'init',
                    contestId: contestId,
                    userId: userId
                }));
            }
        } else if(WebSocketSingleton.instance.readyState === WebSocket.CONNECTING){
            // If socket is connecting, update init data so it will be sent when open
            console.log("Socket is connecting, updating init data");
            WebSocketSingleton.initData = { userId, contestId };
            
            // Add a timeout to detect if connection is stuck
            setTimeout(() => {
                if(WebSocketSingleton.instance && WebSocketSingleton.instance.readyState === WebSocket.CONNECTING){
                    console.error("WebSocket connection timeout - still in CONNECTING state after 5 seconds");
                    console.error("Please check if WSS server is running on ws://localhost:8080");
                }
            }, 5000);
        }
        
        return WebSocketSingleton.instance;
    }
}

