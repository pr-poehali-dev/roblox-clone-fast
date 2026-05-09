import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [friendRequests, setFriendRequests] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className="relative w-10 h-5 transition-all"
      style={{
        background: value ? 'var(--neon-green)' : 'var(--dark-border)',
        borderRadius: '2px',
      }}>
      <span className="absolute top-0.5 transition-all h-4 w-4" style={{
        background: value ? 'var(--dark-bg)' : '#6b7280',
        left: value ? 'calc(100% - 18px)' : '2px',
      }} />
    </button>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="retro-card p-5 mb-4">
      <h2 className="font-pixel text-xs mb-4" style={{ color: 'var(--neon-green)', fontSize: '9px' }}>{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const Row = ({ label, desc, control }: { label: string; desc?: string; control: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-4" style={{ borderBottom: '1px solid var(--dark-border)', paddingBottom: '12px' }}>
      <div>
        <div className="font-orbitron font-bold text-white text-xs">{label}</div>
        {desc && <div style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'Rubik', marginTop: '2px' }}>{desc}</div>}
      </div>
      {control}
    </div>
  );

  return (
    <div className="grid-bg min-h-screen" style={{ paddingTop: '22px' }}>
      <div className="max-w-2xl mx-auto px-4 py-6">

        <h1 className="font-pixel text-xs mb-5 animate-fade-in" style={{ color: '#8892a4', fontSize: '14px' }}>⚙️ НАСТРОЙКИ</h1>

        <div className="animate-fade-in delay-100">
          <Section title="👤 ПРОФИЛЬ">
            <Row label="Никнейм" desc="ДракоМастер" control={<button className="font-pixel text-xs px-3 py-1.5" style={{ border: '1px solid var(--dark-border)', color: '#8892a4', fontSize: '8px' }}>ИЗМЕНИТЬ</button>} />
            <Row label="Аватар" desc="Изменить фото профиля" control={<button className="font-pixel text-xs px-3 py-1.5" style={{ border: '1px solid var(--dark-border)', color: '#8892a4', fontSize: '8px' }}>ЗАГРУЗИТЬ</button>} />
            <Row label="Публичный профиль" desc="Другие игроки могут просматривать твой профиль" control={<Toggle value={publicProfile} onChange={setPublicProfile} />} />
          </Section>

          <Section title="🔔 УВЕДОМЛЕНИЯ">
            <Row label="Push-уведомления" desc="Получать уведомления об игровых событиях" control={<Toggle value={notifications} onChange={setNotifications} />} />
            <Row label="Запросы в друзья" desc="Уведомлять при новых запросах" control={<Toggle value={friendRequests} onChange={setFriendRequests} />} />
          </Section>

          <Section title="🎵 ЗВУК И ГРАФИКА">
            <Row label="Звуковые эффекты" desc="Звуки интерфейса и уведомлений" control={<Toggle value={sounds} onChange={setSounds} />} />
            <Row label="Качество графики" desc="Высокое" control={
              <select style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', color: '#8892a4', padding: '4px 8px', fontFamily: 'Rubik', fontSize: '12px' }}>
                <option>Высокое</option><option>Среднее</option><option>Низкое</option>
              </select>
            } />
          </Section>

          <Section title="🔐 БЕЗОПАСНОСТЬ">
            <Row label="Двухфакторная аутентификация" desc="Дополнительная защита аккаунта" control={<Toggle value={twoFactor} onChange={setTwoFactor} />} />
            <Row label="Пароль" desc="Последнее изменение: никогда" control={<button className="font-pixel text-xs px-3 py-1.5" style={{ border: '1px solid var(--dark-border)', color: '#8892a4', fontSize: '8px' }}>ИЗМЕНИТЬ</button>} />
          </Section>

          <div className="text-center">
            <button className="font-pixel text-xs px-6 py-2" style={{ border: '1px solid var(--destructive)', color: 'hsl(var(--destructive))', fontSize: '8px' }}>
              🚪 ВЫЙТИ ИЗ АККАУНТА
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
