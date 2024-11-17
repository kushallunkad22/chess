import { PersonIcon } from '@radix-ui/react-icons';

export const Button = ({ onClick , children } : { onClick : () => void, children : React.ReactNode }) => {
   return ( <button onClick = {onClick} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center w-full">
  <PersonIcon className="mr-2" />
  {children}
</button>
)
}