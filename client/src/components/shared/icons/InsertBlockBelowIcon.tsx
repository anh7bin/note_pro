interface Props {
    size?: number;
}

export const InsertBlockBelowIcon = ({ size = 16 }: Props) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M20 17.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-3A1.5 1.5 0 0 1 5.5 13h13a1.5 1.5 0 0 1 1.5 1.5v3Z"
                fill="currentColor"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 6.5v3A1.5 1.5 0 0 0 5.5 11h13A1.5 1.5 0 0 0 20 9.5v-3A1.5 1.5 0 0 0 18.5 5h-13A1.5 1.5 0 0 0 4 6.5Zm1 0v3a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5Z"
                fill="currentColor"
            />
        </svg>
    );
};
