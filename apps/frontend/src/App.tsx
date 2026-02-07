
import { Header } from "./components/Landing/Header";
import { LandingPage } from "./components/Landing/Landing";
import { DecorativeBackground } from "./components/DecorativeBackground";
import { Routes, Route,} from "react-router-dom";
import { ChatRoom } from "./components/Chat/ChatRoom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<div className="font-['Patrick_Hand',_cursive]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');
        
        @keyframes wobble {
          0%, 100% { transform: rotate(-0.5deg); }
          50% { transform: rotate(0.5deg); }
        }
      `}</style>
      <DecorativeBackground />
      <Header />
      <LandingPage />
    </div>}></Route>
      <Route path="/chat/:roomId" element={    <div className="font-['Patrick_Hand',cursive]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');
        
        @keyframes wobble {
          0%, 100% { transform: rotate(-0.5deg); }
          50% { transform: rotate(0.5deg); }
        }
      `}</style>
      <DecorativeBackground />
      <ChatRoom/>
    </div>}></Route>
    </Routes>
  )
}

export default App;