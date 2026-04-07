# workout_log query

WITH uid AS (SELECT 'MY_CUSTOMER_ID'::uuid AS val)
INSERT INTO workout_logs (id, user_id, exercise, sets, reps, weight_kg, created_at, updated_at)
SELECT gen_random_uuid(), uid.val, d.exercise, d.sets, d.reps, d.weight_kg, d.ts, NOW()
FROM uid,
(VALUES
  -- Day -16: Chest (grupă mare) + Triceps (grupă mică)
  ('Bench Press',               4, 8,  60.0,  NOW() - INTERVAL '16 days'),
  ('Incline Dumbbell Press',    4, 10, 22.5,  NOW() - INTERVAL '16 days'),
  ('Cable Flye',                3, 12, 15.0,  NOW() - INTERVAL '16 days'),
  ('Dips',                      3, 8,  75.0,  NOW() - INTERVAL '16 days'),
  ('Tricep Pushdown',           4, 12, 20.0,  NOW() - INTERVAL '16 days'),
  ('Skull Crushers',            3, 10, 25.0,  NOW() - INTERVAL '16 days'),
  ('Close Grip Bench Press',    3, 8,  50.0,  NOW() - INTERVAL '16 days'),
  ('Overhead Tricep Extension', 3, 12, 15.0,  NOW() - INTERVAL '16 days'),

  -- Day -14: Back (grupă mare) + Biceps (grupă mică)
  ('Deadlift',                  3, 5,  100.0, NOW() - INTERVAL '14 days'),
  ('Barbell Row',               4, 8,  60.0,  NOW() - INTERVAL '14 days'),
  ('Pull-up',                   4, 8,  75.0,  NOW() - INTERVAL '14 days'),
  ('Lat Pulldown',              3, 12, 55.0,  NOW() - INTERVAL '14 days'),
  ('Barbell Curl',              4, 10, 30.0,  NOW() - INTERVAL '14 days'),
  ('Hammer Curl',               3, 12, 15.0,  NOW() - INTERVAL '14 days'),
  ('Incline Dumbbell Curl',     3, 10, 12.5,  NOW() - INTERVAL '14 days'),
  ('Concentration Curl',        3, 12, 10.0,  NOW() - INTERVAL '14 days'),

  -- Day -12: Legs (grupă mare) + Abs (grupă mică)
  ('Squat',                     5, 5,  80.0,  NOW() - INTERVAL '12 days'),
  ('Romanian Deadlift',         3, 10, 70.0,  NOW() - INTERVAL '12 days'),
  ('Leg Press',                 4, 12, 120.0, NOW() - INTERVAL '12 days'),
  ('Lunges',                    3, 10, 20.0,  NOW() - INTERVAL '12 days'),
  ('Cable Crunch',              4, 15, 25.0,  NOW() - INTERVAL '12 days'),
  ('Russian Twist',             3, 20, 10.0,  NOW() - INTERVAL '12 days'),
  ('Weighted Sit-up',           3, 15, 10.0,  NOW() - INTERVAL '12 days'),
  ('Leg Raise with Weight',     3, 12, 5.0,   NOW() - INTERVAL '12 days'),

  -- Day -10: Shoulders (grupă mare) + Triceps (grupă mică)
  ('Overhead Press',            4, 8,  40.0,  NOW() - INTERVAL '10 days'),
  ('Lateral Raise',             4, 15, 8.0,   NOW() - INTERVAL '10 days'),
  ('Front Raise',               3, 12, 10.0,  NOW() - INTERVAL '10 days'),
  ('Face Pull',                 3, 15, 15.0,  NOW() - INTERVAL '10 days'),
  ('Tricep Pushdown',           4, 12, 22.5,  NOW() - INTERVAL '10 days'),
  ('Skull Crushers',            3, 10, 27.5,  NOW() - INTERVAL '10 days'),
  ('Close Grip Bench Press',    3, 8,  52.5,  NOW() - INTERVAL '10 days'),
  ('Overhead Tricep Extension', 3, 12, 17.5,  NOW() - INTERVAL '10 days'),

  -- Day -8: Chest + Triceps (progresie)
  ('Bench Press',               4, 8,  62.5,  NOW() - INTERVAL '8 days'),
  ('Incline Dumbbell Press',    4, 10, 24.0,  NOW() - INTERVAL '8 days'),
  ('Cable Flye',                3, 12, 17.5,  NOW() - INTERVAL '8 days'),
  ('Dips',                      3, 8,  75.0,  NOW() - INTERVAL '8 days'),
  ('Tricep Pushdown',           4, 12, 22.5,  NOW() - INTERVAL '8 days'),
  ('Skull Crushers',            3, 10, 27.5,  NOW() - INTERVAL '8 days'),
  ('Close Grip Bench Press',    3, 8,  52.5,  NOW() - INTERVAL '8 days'),
  ('Overhead Tricep Extension', 3, 12, 17.5,  NOW() - INTERVAL '8 days'),

  -- Day -6: Back + Biceps (progresie)
  ('Deadlift',                  3, 5,  105.0, NOW() - INTERVAL '6 days'),
  ('Barbell Row',               4, 8,  62.5,  NOW() - INTERVAL '6 days'),
  ('Pull-up',                   4, 9,  75.0,  NOW() - INTERVAL '6 days'),
  ('Lat Pulldown',              3, 12, 57.5,  NOW() - INTERVAL '6 days'),
  ('Barbell Curl',              4, 10, 32.5,  NOW() - INTERVAL '6 days'),
  ('Hammer Curl',               3, 12, 16.0,  NOW() - INTERVAL '6 days'),
  ('Incline Dumbbell Curl',     3, 10, 13.0,  NOW() - INTERVAL '6 days'),
  ('Concentration Curl',        3, 12, 11.0,  NOW() - INTERVAL '6 days'),

  -- Day -4: Legs + Abs (progresie)
  ('Squat',                     5, 5,  82.5,  NOW() - INTERVAL '4 days'),
  ('Romanian Deadlift',         3, 10, 72.5,  NOW() - INTERVAL '4 days'),
  ('Leg Press',                 4, 12, 125.0, NOW() - INTERVAL '4 days'),
  ('Lunges',                    3, 10, 22.5,  NOW() - INTERVAL '4 days'),
  ('Cable Crunch',              4, 15, 27.5,  NOW() - INTERVAL '4 days'),
  ('Russian Twist',             3, 20, 12.0,  NOW() - INTERVAL '4 days'),
  ('Weighted Sit-up',           3, 15, 12.0,  NOW() - INTERVAL '4 days'),
  ('Leg Raise with Weight',     3, 12, 7.5,   NOW() - INTERVAL '4 days'),

  -- Day -2: Shoulders + Triceps (progresie)
  ('Overhead Press',            4, 8,  42.5,  NOW() - INTERVAL '2 days'),
  ('Lateral Raise',             4, 15, 9.0,   NOW() - INTERVAL '2 days'),
  ('Front Raise',               3, 12, 11.0,  NOW() - INTERVAL '2 days'),
  ('Face Pull',                 3, 15, 17.5,  NOW() - INTERVAL '2 days'),
  ('Tricep Pushdown',           4, 12, 25.0,  NOW() - INTERVAL '2 days'),
  ('Skull Crushers',            3, 10, 30.0,  NOW() - INTERVAL '2 days'),
  ('Close Grip Bench Press',    3, 8,  55.0,  NOW() - INTERVAL '2 days'),
  ('Overhead Tricep Extension', 3, 12, 20.0,  NOW() - INTERVAL '2 days')
) AS d(exercise, sets, reps, weight_kg, ts);

https://www.reddit.com/r/workout/comments/1ky6j1c/what_features_do_you_think_a_great_fitness/
https://www.quora.com/What-are-the-best-and-unique-features-that-a-fitness-app-can-have