-- Create exercises table
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('cardio', 'strength', 'flexibility', 'balance')),
  duration integer not null check (duration > 0), -- in minutes
  sets integer,
  reps integer,
  notes text,
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create workouts table
create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration integer not null check (duration > 0), -- in minutes
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  created_by uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create workout_exercises junction table
create table public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid references public.workouts(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) on delete cascade not null,
  order_index integer not null default 0,
  created_at timestamptz default now() not null,
  unique(workout_id, exercise_id)
);

-- Create workout_plans table
create table public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  trainer_id uuid references auth.users(id) on delete cascade not null,
  start_date timestamptz not null,
  end_date timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create plan_workouts table
create table public.plan_workouts (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references public.workout_plans(id) on delete cascade not null,
  workout_id uuid references public.workouts(id) on delete cascade not null,
  scheduled_date timestamptz not null,
  completed boolean default false not null,
  completed_date timestamptz,
  feedback text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create plan_trainees junction table
create table public.plan_trainees (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references public.workout_plans(id) on delete cascade not null,
  trainee_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(plan_id, trainee_id)
);

-- Create workout_progress table
create table public.workout_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  workout_id uuid references public.workouts(id) on delete cascade not null,
  plan_id uuid references public.workout_plans(id) on delete set null,
  completed_date timestamptz not null,
  duration integer not null, -- actual duration in minutes
  calories_burned integer,
  avg_heart_rate integer,
  max_heart_rate integer,
  notes text,
  created_at timestamptz default now() not null
);

-- Create trainee_groups table
create table public.trainee_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trainer_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create group_members junction table
create table public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.trainee_groups(id) on delete cascade not null,
  trainee_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(group_id, trainee_id)
);

-- Create invites table
create table public.invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  trainer_id uuid references auth.users(id) on delete cascade not null,
  group_id uuid references public.trainee_groups(id) on delete set null,
  status text not null check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  expires_at timestamptz not null,
  created_at timestamptz default now() not null
);

-- Enable RLS on all tables
alter table public.exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.workout_plans enable row level security;
alter table public.plan_workouts enable row level security;
alter table public.plan_trainees enable row level security;
alter table public.workout_progress enable row level security;
alter table public.trainee_groups enable row level security;
alter table public.group_members enable row level security;
alter table public.invites enable row level security;

-- RLS Policies for exercises
create policy "Users can view exercises they created or are part of their workouts"
  on public.exercises for select
  to authenticated
  using (
    created_by = auth.uid() or
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on we.workout_id = w.id
      where we.exercise_id = exercises.id
      and (w.created_by = auth.uid() or exists (
        select 1 from public.plan_workouts pw
        join public.plan_trainees pt on pw.plan_id = pt.plan_id
        where pw.workout_id = w.id and pt.trainee_id = auth.uid()
      ))
    )
  );

create policy "Trainers can create exercises"
  on public.exercises for insert
  to authenticated
  with check (
    created_by = auth.uid() and
    public.has_role(auth.uid(), 'trainer')
  );

create policy "Users can update their own exercises"
  on public.exercises for update
  to authenticated
  using (created_by = auth.uid());

create policy "Users can delete their own exercises"
  on public.exercises for delete
  to authenticated
  using (created_by = auth.uid());

-- RLS Policies for workouts
create policy "Users can view workouts they created or are assigned to"
  on public.workouts for select
  to authenticated
  using (
    created_by = auth.uid() or
    exists (
      select 1 from public.plan_workouts pw
      join public.plan_trainees pt on pw.plan_id = pt.plan_id
      where pw.workout_id = workouts.id and pt.trainee_id = auth.uid()
    )
  );

create policy "Trainers can create workouts"
  on public.workouts for insert
  to authenticated
  with check (
    created_by = auth.uid() and
    public.has_role(auth.uid(), 'trainer')
  );

create policy "Trainers can update their own workouts"
  on public.workouts for update
  to authenticated
  using (created_by = auth.uid());

create policy "Trainers can delete their own workouts"
  on public.workouts for delete
  to authenticated
  using (created_by = auth.uid());

-- RLS Policies for workout_exercises
create policy "Users can view workout exercises"
  on public.workout_exercises for select
  to authenticated
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_exercises.workout_id
      and (w.created_by = auth.uid() or exists (
        select 1 from public.plan_workouts pw
        join public.plan_trainees pt on pw.plan_id = pt.plan_id
        where pw.workout_id = w.id and pt.trainee_id = auth.uid()
      ))
    )
  );

create policy "Trainers can manage workout exercises"
  on public.workout_exercises for all
  to authenticated
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_exercises.workout_id and w.created_by = auth.uid()
    )
  );

-- RLS Policies for workout_plans
create policy "Trainers can view their own plans"
  on public.workout_plans for select
  to authenticated
  using (trainer_id = auth.uid());

create policy "Trainees can view plans assigned to them"
  on public.workout_plans for select
  to authenticated
  using (
    exists (
      select 1 from public.plan_trainees pt
      where pt.plan_id = workout_plans.id and pt.trainee_id = auth.uid()
    )
  );

create policy "Trainers can create workout plans"
  on public.workout_plans for insert
  to authenticated
  with check (
    trainer_id = auth.uid() and
    public.has_role(auth.uid(), 'trainer')
  );

create policy "Trainers can update their own plans"
  on public.workout_plans for update
  to authenticated
  using (trainer_id = auth.uid());

create policy "Trainers can delete their own plans"
  on public.workout_plans for delete
  to authenticated
  using (trainer_id = auth.uid());

-- RLS Policies for plan_workouts
create policy "Users can view plan workouts"
  on public.plan_workouts for select
  to authenticated
  using (
    exists (
      select 1 from public.workout_plans wp
      where wp.id = plan_workouts.plan_id
      and (wp.trainer_id = auth.uid() or exists (
        select 1 from public.plan_trainees pt
        where pt.plan_id = wp.id and pt.trainee_id = auth.uid()
      ))
    )
  );

create policy "Trainers can manage plan workouts"
  on public.plan_workouts for all
  to authenticated
  using (
    exists (
      select 1 from public.workout_plans wp
      where wp.id = plan_workouts.plan_id and wp.trainer_id = auth.uid()
    )
  );

create policy "Trainees can update completion status"
  on public.plan_workouts for update
  to authenticated
  using (
    exists (
      select 1 from public.plan_trainees pt
      where pt.plan_id = plan_workouts.plan_id and pt.trainee_id = auth.uid()
    )
  );

-- RLS Policies for plan_trainees
create policy "Users can view plan assignments"
  on public.plan_trainees for select
  to authenticated
  using (
    trainee_id = auth.uid() or
    exists (
      select 1 from public.workout_plans wp
      where wp.id = plan_trainees.plan_id and wp.trainer_id = auth.uid()
    )
  );

create policy "Trainers can manage plan assignments"
  on public.plan_trainees for all
  to authenticated
  using (
    exists (
      select 1 from public.workout_plans wp
      where wp.id = plan_trainees.plan_id and wp.trainer_id = auth.uid()
    )
  );

-- RLS Policies for workout_progress
create policy "Users can view their own progress"
  on public.workout_progress for select
  to authenticated
  using (user_id = auth.uid());

create policy "Trainers can view progress of their trainees"
  on public.workout_progress for select
  to authenticated
  using (
    exists (
      select 1 from public.plan_trainees pt
      join public.workout_plans wp on pt.plan_id = wp.id
      where pt.trainee_id = workout_progress.user_id
      and wp.trainer_id = auth.uid()
    )
  );

create policy "Users can insert their own progress"
  on public.workout_progress for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own progress"
  on public.workout_progress for update
  to authenticated
  using (user_id = auth.uid());

create policy "Users can delete their own progress"
  on public.workout_progress for delete
  to authenticated
  using (user_id = auth.uid());

-- RLS Policies for trainee_groups
create policy "Trainers can view their own groups"
  on public.trainee_groups for select
  to authenticated
  using (trainer_id = auth.uid());

create policy "Trainees can view groups they are in"
  on public.trainee_groups for select
  to authenticated
  using (
    exists (
      select 1 from public.group_members gm
      where gm.group_id = trainee_groups.id and gm.trainee_id = auth.uid()
    )
  );

create policy "Trainers can create groups"
  on public.trainee_groups for insert
  to authenticated
  with check (
    trainer_id = auth.uid() and
    public.has_role(auth.uid(), 'trainer')
  );

create policy "Trainers can update their own groups"
  on public.trainee_groups for update
  to authenticated
  using (trainer_id = auth.uid());

create policy "Trainers can delete their own groups"
  on public.trainee_groups for delete
  to authenticated
  using (trainer_id = auth.uid());

-- RLS Policies for group_members
create policy "Users can view group memberships"
  on public.group_members for select
  to authenticated
  using (
    trainee_id = auth.uid() or
    exists (
      select 1 from public.trainee_groups tg
      where tg.id = group_members.group_id and tg.trainer_id = auth.uid()
    )
  );

create policy "Trainers can manage group memberships"
  on public.group_members for all
  to authenticated
  using (
    exists (
      select 1 from public.trainee_groups tg
      where tg.id = group_members.group_id and tg.trainer_id = auth.uid()
    )
  );

-- RLS Policies for invites
create policy "Trainers can view invites they sent"
  on public.invites for select
  to authenticated
  using (trainer_id = auth.uid());

create policy "Trainers can create invites"
  on public.invites for insert
  to authenticated
  with check (
    trainer_id = auth.uid() and
    public.has_role(auth.uid(), 'trainer')
  );

create policy "Trainers can update their own invites"
  on public.invites for update
  to authenticated
  using (trainer_id = auth.uid());

create policy "Trainers can delete their own invites"
  on public.invites for delete
  to authenticated
  using (trainer_id = auth.uid());

-- Add triggers for updated_at
create trigger set_exercises_updated_at
  before update on public.exercises
  for each row execute function public.handle_updated_at();

create trigger set_workouts_updated_at
  before update on public.workouts
  for each row execute function public.handle_updated_at();

create trigger set_workout_plans_updated_at
  before update on public.workout_plans
  for each row execute function public.handle_updated_at();

create trigger set_plan_workouts_updated_at
  before update on public.plan_workouts
  for each row execute function public.handle_updated_at();

create trigger set_trainee_groups_updated_at
  before update on public.trainee_groups
  for each row execute function public.handle_updated_at();

-- Enable realtime for key tables
alter publication supabase_realtime add table public.workout_progress;
alter publication supabase_realtime add table public.plan_workouts;
alter publication supabase_realtime add table public.group_members;

-- Create indexes for performance
create index idx_exercises_created_by on public.exercises(created_by);
create index idx_workouts_created_by on public.workouts(created_by);
create index idx_workout_exercises_workout_id on public.workout_exercises(workout_id);
create index idx_workout_exercises_exercise_id on public.workout_exercises(exercise_id);
create index idx_workout_plans_trainer_id on public.workout_plans(trainer_id);
create index idx_plan_workouts_plan_id on public.plan_workouts(plan_id);
create index idx_plan_workouts_workout_id on public.plan_workouts(workout_id);
create index idx_plan_workouts_scheduled_date on public.plan_workouts(scheduled_date);
create index idx_plan_trainees_plan_id on public.plan_trainees(plan_id);
create index idx_plan_trainees_trainee_id on public.plan_trainees(trainee_id);
create index idx_workout_progress_user_id on public.workout_progress(user_id);
create index idx_workout_progress_workout_id on public.workout_progress(workout_id);
create index idx_workout_progress_completed_date on public.workout_progress(completed_date);
create index idx_trainee_groups_trainer_id on public.trainee_groups(trainer_id);
create index idx_group_members_group_id on public.group_members(group_id);
create index idx_group_members_trainee_id on public.group_members(trainee_id);
create index idx_invites_trainer_id on public.invites(trainer_id);
create index idx_invites_email on public.invites(email);