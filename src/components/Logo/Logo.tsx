import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Logo: React.FC = () => {
  return (
    <div className="text-3xl text-center py-4">
      <span>Blog Standard</span>
      <FontAwesomeIcon
        className="text-2xl text-slate-400 inline-block ml-2"
        icon={faBrain}
        width={32}
      />
    </div>
  );
};
