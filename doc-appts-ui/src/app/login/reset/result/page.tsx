import styles from '@/app/login/login.module.css';

export default function Page() {
    return (
        <div className={styles.loginForm}>
            <br></br><br></br><br></br>
            <p>If email is valid and user exists for email, a password reset link has been sent to your email</p>
        </div>
    )
}