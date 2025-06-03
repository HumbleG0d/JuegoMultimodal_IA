import type { InputProps } from "../../types";

const Input: React.FC<InputProps> = ({
    label,
    type,
    name,
    value,
    onChange,
    required = false,
    placeholder = ''
}) => {
    return (
        <div className="mb-4">
            <label className="block text-white mb-2\" htmlFor={name}>
                {label}
            </label>
            <input
                className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
            />
        </div>
    );
};

export default Input;