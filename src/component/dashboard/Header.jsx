import {Bell} from 'lucide-react';
import IconButton from '../shared/icon-button';
import { username } from './services/username';


export default function Header(){
    username;
    return(
        <div className="flex flex-row justify-between items-center px-4 py-5 pt-0">
            <div className="flex flex-row justify-center items-center gap-2">
                <div className="bg-blue-500 w-10 h-10 rounded-full flex justify-center items-center ">
                    Y
                </div>
                <div className="flex flex-col">
                    <div className="text-xs">
                        Good Morning
                    </div>
                    <div className="text-xs font-semibold">
                        Aditya
                    </div>
                </div>
            </div>
            <div>
                <IconButton icon={Bell}  size={20}/>
            </div>

        </div>
    )
}