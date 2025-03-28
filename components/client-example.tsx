"useclient";

import { useSession } from "next-auth/react"; 



export default function ClientExample(){
    const { data: session } = useSession(); // status を追加
    console.log("sessionnnn",session)
    return <div>クライアントサイドのコンポーネント</div>;
}