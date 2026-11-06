import { ArrowRight, Building2 } from 'lucide-react';
import { SignInForm } from '@/features/sign-in';

export function LoginPage({ initialError }: { initialError: string }) {
  return (
    <div className="login-layout">
      <section className="login-intro">
        <div className="brand">
          <Building2 size={27} />
          Объекты и задачи
        </div>
        <div>
          <h1>
            От постановки
            <br />
            до приёмки.
          </h1>
          <p>Задачи строительной команды, объекты и история решений — в одном месте.</p>
          <div className="intro-flow">
            <span>Задача</span>
            <ArrowRight size={18} />
            <span>Работа</span>
            <ArrowRight size={18} />
            <span>Приёмка</span>
          </div>
        </div>
        <small>Мини-CRM для строительной компании</small>
      </section>
      <main className="login-main">
        <div className="login-form">
          <h2>Вход в систему</h2>
          <p className="muted">Войдите с учётной записью, которую выдал администратор.</p>
          <SignInForm initialError={initialError} />
          <p className="login-foot">
            Открытая регистрация не предусмотрена.
            <br />
            За доступом обратитесь к администратору.
          </p>
        </div>
      </main>
    </div>
  );
}
