import {CreditCard} from "lucide-react";

const CreditsDisplay = ({credits}) => {
    console.log('credits from context', credits);
    return (
        <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 transition-colors duration-300">
            <CreditCard size={16}/>
            <span className="font-medium">{credits}</span>
            <span className="text-xs">Credits</span>
        </div>
    )
}

export default CreditsDisplay;