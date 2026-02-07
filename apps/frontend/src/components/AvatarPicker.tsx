import {motion} from "framer-motion"

export const AvatarPicker: React.FC<{
  selected: string;
  onSelect: (seed: string) => void;
}> = ({ selected, onSelect }) => {
  const seeds = ['Felix', 'Aneka', 'Luna', 'Max', 'Bella', 'Charlie', 'Daisy', 'Cooper'];
  
  return (
    <div className="mb-5">
      <label className="text-lg text-purple-800 mb-2 block font-bold">
        Pick Your Avatar ✨
      </label>
      <div className="grid grid-cols-4 gap-3">
        {seeds.map((seed) => (
          <motion.div
            key={seed}
            whileHover={{ scale: 1.15, rotate: 8 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(seed)}
            className={`cursor-pointer rounded-full p-1 bg-white ${
              selected === seed ? 'border-4 border-pink-500 shadow-lg shadow-pink-500/40' : 'border-3 border-gray-300'
            }`}
            style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
          >
            <img
              src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`}
              alt={seed}
              className="w-16 h-16 block"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};