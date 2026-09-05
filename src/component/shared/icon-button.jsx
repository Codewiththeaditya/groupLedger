export default function IconButton({icon: Icon, label,size}){
    return(
        <div className="flex flex-col items-center py-2">
            <Icon size={size || 20}/>
            <span className="text-xs">{label}</span>
        </div>
    )
}