-- Run ONCE in the Supabase SQL Editor, after the migration and creating 3 Auth users.
-- Replace emails below if your test accounts use different emails.
-- Passwords are set in Auth, never in this file.
begin;
do $$
declare
  manager_id uuid;
  first_id uuid;
  second_id uuid;
  project_one uuid;
  project_two uuid;
  project_three uuid;
  task_one uuid;
  task_two uuid;
  task_three uuid;
  task_four uuid;
  task_five uuid;
begin
  select id into manager_id from auth.users where lower(email) = 'manager@example.com';
  select id into first_id from auth.users where lower(email) = 'executor1@example.com';
  select id into second_id from auth.users where lower(email) = 'executor2@example.com';
  if manager_id is null or first_id is null or second_id is null then
    raise exception 'Сначала создайте в Supabase Auth manager@example.com, executor1@example.com и executor2@example.com или замените email в seed.sql';
  end if;
  if exists(select 1 from public.profiles where id in (manager_id, first_id, second_id)) then
    raise exception 'Профили уже существуют. Этот seed рассчитан на однократный запуск в новой базе.';
  end if;
  insert into public.profiles(id, display_name, role) values
    (manager_id, 'Алексей Смирнов', 'manager'),
    (first_id, 'Илья Волков', 'executor'),
    (second_id, 'Мария Орлова', 'executor');

  insert into public.projects(name,address) values ('ЖК «Сосновый квартал»','ул. Лесная, 24, корпус 2') returning id into project_one;
  insert into public.projects(name,address) values ('Бизнес-центр «Горизонт»','проспект Мира, 118') returning id into project_two;
  insert into public.projects(name,address) values ('Школа в Новом районе','ул. Строителей, 7') returning id into project_three;

  -- Emulate the authenticated actor only in this trusted administrative seed.
  -- All status changes still go through the same transition function as the UI.
  perform set_config('request.jwt.claim.sub', manager_id::text, true);
  insert into public.tasks(title,description,project_id,assignee_id) values
    ('Проверить армирование перекрытия','Сверить шаг арматуры с рабочей документацией. Проверить защитный слой.',project_one,first_id) returning id into task_one;
  insert into public.tasks(title,description,project_id,assignee_id) values
    ('Подготовить акт скрытых работ','Подготовить акт по гидроизоляции подземного этажа.',project_one,second_id) returning id into task_two;
  insert into public.tasks(title,description,project_id,assignee_id) values
    ('Уточнить схему электроснабжения','Внести замечания по расположению щитов.',project_two,first_id) returning id into task_three;
  insert into public.tasks(title,description,project_id,assignee_id) values
    ('Проверить поставку материалов','Сверить количество и маркировку по накладной.',project_two,second_id) returning id into task_four;
  insert into public.tasks(title,description,project_id,assignee_id) values
    ('Согласовать план благоустройства','Проверить расположение дорожек и озеленение.',project_three,first_id) returning id into task_five;

  perform set_config('request.jwt.claim.sub', first_id::text, true);
  perform public.transition_task(task_one,'new','in_progress');
  perform public.transition_task(task_one,'in_progress','review','Проверка выполнена, замечаний нет.');
  perform public.transition_task(task_three,'new','in_progress');
  perform public.transition_task(task_three,'in_progress','review');
  perform public.transition_task(task_five,'new','in_progress');
  perform public.transition_task(task_five,'in_progress','review');

  perform set_config('request.jwt.claim.sub', second_id::text, true);
  perform public.transition_task(task_two,'new','in_progress');

  perform set_config('request.jwt.claim.sub', manager_id::text, true);
  perform public.transition_task(task_three,'review','rework','Добавьте привязки щитов к осям здания.');
  perform public.transition_task(task_five,'review','accepted','План согласован.');
end;
$$;
commit;
