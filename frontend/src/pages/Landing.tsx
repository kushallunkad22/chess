import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();
    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-8 max-w-6xl w-full">
        <div className="w-full max-w-[32rem] h-[32rem] relative">
          <img
            src="chessboard.png"
            alt="Chess Board"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center lg:text-left w-full max-w-md">
          <h1 className="text-4xl font-bold mb-4">Play Chess Online on the #1 Site!</h1>
          <div className="flex justify-between mb-6 text-sm">
            <p>15,450,428 Games Today</p>
            <p>174,314 Playing Now</p>
          </div>
          <Button onClick={() => {
            navigate('/game');
          }}>
            Play Online
          </Button>
        </div>
      </div>
    </div>
  )
}