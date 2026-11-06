export type Role = 'manager' | 'executor';
export interface Profile {
    id: string;
    display_name: string;
    role: Role;
}
export const roles: Record<Role, string> = { manager: 'Постановщик', executor: 'Исполнитель' };
