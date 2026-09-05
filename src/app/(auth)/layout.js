import IconButton from '@/component/shared/icon-button';
import { ChevronLeft } from 'lucide-react';


export default function AuthLayout({children}){
    return(
        <main className="min-h-screen flex flex-col">
            <div className="w-fit px-2 py-2">
                <IconButton icon={ChevronLeft} size="30"/>
            </div>
            <div className="flex-1 ">
                {children}
            </div>
        </main>
    )
}