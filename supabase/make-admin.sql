-- Run AFTER creating your login in Supabase → Authentication → Users → "Add user".
-- Change the email below if you sign in with a different one.
insert into public.admins (user_id)
select id from auth.users where email = 'kumkumdahrejawork@gmail.com'
on conflict do nothing;
