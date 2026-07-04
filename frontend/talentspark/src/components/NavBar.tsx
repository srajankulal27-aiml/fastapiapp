type Props = {
    onLogout?: () => void;
}

function NavBar({onLogout}: Props) {
    return (
        <nav>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
                {onLogout && <li><button onClick={onLogout}>Logout</button></li>}
            </ul>
        </nav>
    )
}

export default NavBar