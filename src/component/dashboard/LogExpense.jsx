import IconButton from "../shared/icon-button";
import { ScrollText } from 'lucide-react';


export default function LogExpense(){
    return(
    <a href="/addExpense">
        <div className="fixed bottom-22 right-2 z-50 text-white bg-blue-900 text-lg px-3 py-2 rounded-4xl flex flex-row gap-3 justify-center items-center">
            
                <div><IconButton icon={ScrollText} /></div>
                <div >Add expense</div>
            
        </div>
    </a>
    )
}