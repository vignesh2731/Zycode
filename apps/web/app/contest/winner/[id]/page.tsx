import WinnerPage from "@/components/Winner";

export default async function Page({params}:{params: Promise<{id:string}>}){
    const {id} = await params;
    const name = "Vignesh";
    // const name = getWinner();
    if(name){
        return (
            <div className="h-screen">
                <WinnerPage winner={name} contestCode={id}/>
            </div>
        )
    }
    else{
        throw new Error("Contest has not ended yet")
    }
}