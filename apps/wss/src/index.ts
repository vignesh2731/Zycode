import { WebSocketServer, WebSocket } from "ws";
import type { WebSocketDataType } from '@repo/zod'

const wss = new WebSocketServer({port:8080});

console.log("WebSocket Server started on ws://localhost:8080");

const userRoom = new Map<number,WebSocket>();
const socketRoom = new Map<WebSocket,number>();
const contestRoom = new Map<string,WebSocket[]>();
const userContestMapping = new Map<number,string>();

wss.addListener("connection",(ws)=>{    
    ws.on('error', (error) => {
        console.error("WebSocket connection error:", error);
    });
    ws.on('message',(msg)=>{
        const msgAsString = msg.toString('utf-8');
        const parsedData = JSON.parse(msgAsString) as WebSocketDataType;

        // console.log("Parsed message",parsedData);

        if(parsedData.type==='submission_status'){
            if(parsedData.accepted){
                const clients = contestRoom.get(parsedData.contestId);
                clients?.forEach(user=>{
                    if(user.readyState === WebSocket.OPEN){
                        user.send(JSON.stringify({msg:"Correct",solver: parsedData.name,ended: parsedData.ended, winner:parsedData.winner}));
                    } else {
                        console.log("Client socket not open, readyState:", user.readyState);
                    }
                })
            }

            else{
                const userSocket = userRoom.get(parsedData.userId);
                if(userSocket && userSocket.readyState === WebSocket.OPEN){
                    userSocket.send(JSON.stringify({msg:"Wrong"}));
                } else {
                    console.log("User socket not found or not open, readyState:", userSocket?.readyState);
                }
            }
        }
        else if(parsedData.type==='init'){
            const contestId = parsedData.contestId, userId = parsedData.userId;            
            const oldSocket = userRoom.get(userId);
            if(oldSocket && oldSocket !== ws){
                const oldContestId = userContestMapping.get(userId);
                if(oldContestId){
                    const oldRoom = contestRoom.get(oldContestId);
                    if(oldRoom){
                        contestRoom.set(oldContestId, oldRoom.filter(w => w !== oldSocket));
                    }
                }
                socketRoom.delete(oldSocket);
            }
            
            userContestMapping.set(userId,contestId);
            socketRoom.set(ws,userId);
            userRoom.set(userId,ws);
            const room = contestRoom.get(contestId) || [];
            if(!room.includes(ws)){
                room.push(ws);
            }
            contestRoom.set(contestId,room);
        }
        else if(parsedData.type==='contest_started'){
            const contestId = parsedData.contestId;
            const clients = contestRoom.get(contestId);
            clients?.forEach((c)=>{
                c.send(JSON.stringify({msg: "Contest_Started"}));
            })
        }

    })
    ws.on('close',()=>{
        const userId = socketRoom.get(ws);
        if(!userId)return;
        const contestId = userContestMapping.get(userId!);
        userContestMapping.delete(userId!);
        socketRoom.delete(ws);
        const room = contestRoom.get(contestId!);
        if (room) {
            contestRoom.set(contestId!, room.filter(w => w !== ws));
        }
        userRoom.delete(userId!);
    })
})