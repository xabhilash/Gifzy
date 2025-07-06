import { FaInstagram, FaTwitter } from "react-icons/fa6";

const Socials = () => {
  return (
    <div className="font-bold text-sm pt-2">
      <span>Follow on:</span>
      <div className="flex gap-4 pt-3">
        <a href="https://x.com/xLuCfr333">
          <FaTwitter size={20} className="text-gray-400" />
        </a>
        <a href="">
          <FaInstagram size={20} className="text-gray-400" />
        </a>
      </div>
    </div>
  );
};

export default Socials;
