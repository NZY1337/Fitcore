# workout_log query

WITH uid AS (SELECT user_id AS val FROM user_profiles LIMIT 1)
INSERT INTO workout_logs (id, user_id, exercise, sets, reps, weight_kg, created_at, updated_at)
SELECT
    gen_random_uuid(),
    uid.val,
    d.exercise::text,
    d.sets::int,
    d.reps::int,
    d.weight_kg::double precision,
    NOW() - (d.days_ago::int * INTERVAL '1 day'),
    NOW()
FROM uid,
(VALUES
  -- Day -16: Chest + Triceps
  ('Bench Press',               4, 8,  60.0,  16),
  ('Incline Dumbbell Press',    4, 10, 22.5,  16),
  ('Cable Flye',                3, 12, 15.0,  16),
  ('Dips',                      3, 8,  75.0,  16),
  ('Tricep Pushdown',           4, 12, 20.0,  16),
  ('Skull Crushers',            3, 10, 25.0,  16),
  ('Close Grip Bench Press',    3, 8,  50.0,  16),
  ('Overhead Tricep Extension', 3, 12, 15.0,  16),

  -- Day -14: Back + Biceps
  ('Deadlift',                  3, 5,  100.0, 14),
  ('Barbell Row',               4, 8,  60.0,  14),
  ('Pull-up',                   4, 8,  75.0,  14),
  ('Lat Pulldown',              3, 12, 55.0,  14),
  ('Barbell Curl',              4, 10, 30.0,  14),
  ('Hammer Curl',               3, 12, 15.0,  14),
  ('Incline Dumbbell Curl',     3, 10, 12.5,  14),
  ('Concentration Curl',        3, 12, 10.0,  14),

  -- Day -12: Legs + Abs
  ('Squat',                     5, 5,  80.0,  12),
  ('Romanian Deadlift',         3, 10, 70.0,  12),
  ('Leg Press',                 4, 12, 120.0, 12),
  ('Lunges',                    3, 10, 20.0,  12),
  ('Cable Crunch',              4, 15, 25.0,  12),
  ('Russian Twist',             3, 20, 10.0,  12),
  ('Weighted Sit-up',           3, 15, 10.0,  12),
  ('Leg Raise with Weight',     3, 12, 5.0,   12),

  -- Day -10: Shoulders + Triceps
  ('Overhead Press',            4, 8,  40.0,  10),
  ('Lateral Raise',             4, 15, 8.0,   10),
  ('Front Raise',               3, 12, 10.0,  10),
  ('Face Pull',                 3, 15, 15.0,  10),
  ('Tricep Pushdown',           4, 12, 22.5,  10),
  ('Skull Crushers',            3, 10, 27.5,  10),
  ('Close Grip Bench Press',    3, 8,  52.5,  10),
  ('Overhead Tricep Extension', 3, 12, 17.5,  10),

  -- Day -8: Chest + Triceps
  ('Bench Press',               4, 8,  62.5,  8),
  ('Incline Dumbbell Press',    4, 10, 24.0,  8),
  ('Cable Flye',                3, 12, 17.5,  8),
  ('Dips',                      3, 8,  75.0,  8),
  ('Tricep Pushdown',           4, 12, 22.5,  8),
  ('Skull Crushers',            3, 10, 27.5,  8),
  ('Close Grip Bench Press',    3, 8,  52.5,  8),
  ('Overhead Tricep Extension', 3, 12, 17.5,  8),

  -- Day -6: Back + Biceps
  ('Deadlift',                  3, 5,  105.0, 6),
  ('Barbell Row',               4, 8,  62.5,  6),
  ('Pull-up',                   4, 9,  75.0,  6),
  ('Lat Pulldown',              3, 12, 57.5,  6),
  ('Barbell Curl',              4, 10, 32.5,  6),
  ('Hammer Curl',               3, 12, 16.0,  6),
  ('Incline Dumbbell Curl',     3, 10, 13.0,  6),
  ('Concentration Curl',        3, 12, 11.0,  6),

  -- Day -4: Legs + Abs
  ('Squat',                     5, 5,  82.5,  4),
  ('Romanian Deadlift',         3, 10, 72.5,  4),
  ('Leg Press',                 4, 12, 125.0, 4),
  ('Lunges',                    3, 10, 22.5,  4),
  ('Cable Crunch',              4, 15, 27.5,  4),
  ('Russian Twist',             3, 20, 12.0,  4),
  ('Weighted Sit-up',           3, 15, 12.0,  4),
  ('Leg Raise with Weight',     3, 12, 7.5,   4),

  -- Day -2: Shoulders + Triceps
  ('Overhead Press',            4, 8,  42.5,  2),
  ('Lateral Raise',             4, 15, 9.0,   2),
  ('Front Raise',               3, 12, 11.0,  2),
  ('Face Pull',                 3, 15, 17.5,  2),
  ('Tricep Pushdown',           4, 12, 25.0,  2),
  ('Skull Crushers',            3, 10, 30.0,  2),
  ('Close Grip Bench Press',    3, 8,  55.0,  2),
  ('Overhead Tricep Extension', 3, 12, 20.0,  2)
) AS d(exercise, sets, reps, weight_kg, days_ago);
https://www.reddit.com/r/workout/comments/1ky6j1c/what_features_do_you_think_a_great_fitness/
https://www.quora.com/What-are-the-best-and-unique-features-that-a-fitness-app-can-have


# weight logs

INSERT INTO weight_logs (id, user_id, weight_kg, note, measured_at)
SELECT
    gen_random_uuid(),
    up.user_id,
    entry.weight_kg::double precision,
    entry.note::text,
    entry.measured_at::timestamptz
FROM user_profiles up
CROSS JOIN (VALUES
    (101.3, 'Morning weigh-in',          '2026-03-20 07:15:00+00'),
    (101.1, 'Morning weigh-in',          '2026-03-22 07:10:00+00'),
    (100.8, 'After workout',             '2026-03-24 08:00:00+00'),
    (100.5, 'Morning weigh-in',          '2026-03-26 07:20:00+00'),
    (100.9, 'Post rest day',             '2026-03-27 07:30:00+00'),
    (100.2, 'Morning weigh-in',          '2026-03-29 07:15:00+00'),
    ( 99.8, 'Fasted morning',            '2026-03-31 07:00:00+00'),
    ( 99.5, 'Morning weigh-in',          '2026-04-02 07:10:00+00'),
    ( 99.7, 'Post cheat meal',           '2026-04-03 07:20:00+00'),
    ( 99.1, 'Morning weigh-in',          '2026-04-05 07:15:00+00'),
    ( 98.6, 'Fasted morning',            '2026-04-07 07:00:00+00'),
    ( 98.3, 'Morning weigh-in',          '2026-04-08 07:10:00+00'),
    ( 98.0, 'After workout',             '2026-04-09 08:05:00+00'),
    ( 97.5, 'Morning weigh-in',          '2026-04-11 07:15:00+00'),
    ( 97.8, 'Post rest day',             '2026-04-12 07:30:00+00'),
    ( 97.2, 'Morning weigh-in',          '2026-04-13 07:10:00+00'),
    ( 96.7, 'Fasted morning',            '2026-04-14 07:00:00+00'),
    ( 96.3, 'Morning weigh-in',          '2026-04-15 07:15:00+00'),
    ( 95.9, 'After morning run',         '2026-04-16 07:45:00+00'),
    ( 95.5, 'Morning weigh-in',          '2026-04-17 07:10:00+00'),
    ( 95.2, 'Fasted morning',            '2026-04-18 07:00:00+00'),
    ( 95.0, 'Morning weigh-in',          '2026-04-19 07:15:00+00'),
    ( 85.0, 'Goal weight reached!',      '2026-04-20 07:10:00+00')
) AS entry(weight_kg, note, measured_at)
WHERE up.user_id = (SELECT user_id FROM user_profiles LIMIT 1);


#nutrition logs

WITH uid AS (SELECT user_id AS val FROM user_profiles LIMIT 1)
INSERT INTO nutrition_logs (id, user_id, food_item, meal_type, calories, protein_g, carbs_g, fat_g, serving_g, note, logged_at)
SELECT
    gen_random_uuid(),
    uid.val,
    d.food_item::text,
    d.meal_type::text,
    d.calories::double precision,
    d.protein_g::double precision,
    d.carbs_g::double precision,
    d.fat_g::double precision,
    d.serving_g::double precision,
    d.note::text,
    (CURRENT_DATE - (d.days_ago::int)) + d.meal_time::time
FROM uid,
(VALUES
  -- Today
  ('Oatmeal with banana',        'breakfast', 380, 12, 68, 7,  100, 'With honey',           0, '07:30'),
  ('Greek yogurt',               'breakfast', 130, 17,  9, 0,  200, NULL,                   0, '07:30'),
  ('Chicken breast + rice',      'lunch',     520, 48, 55, 8,  300, 'Meal prep',            0, '12:30'),
  ('Broccoli steamed',           'lunch',      55,  4,  8, 1,  150, NULL,                   0, '12:30'),
  ('Protein shake',              'snack',     180, 30,  8, 3,  350, 'Post workout',         0, '16:00'),
  ('Salmon fillet + sweet potato','dinner',   580, 42, 45, 18, 350, NULL,                   0, '19:30'),
  ('Mixed salad',                'dinner',     80,  3,  8, 4,  200, NULL,                   0, '19:30'),

  -- Yesterday
  ('Scrambled eggs + toast',     'breakfast', 420, 24, 38, 18, 250, NULL,                   1, '07:45'),
  ('Orange juice',               'breakfast',  90,  1, 21, 0,  200, NULL,                   1, '07:45'),
  ('Tuna wrap',                  'lunch',     490, 38, 45, 12, 280, 'Whole wheat wrap',     1, '13:00'),
  ('Apple',                      'snack',      95,  0, 25, 0,  182, NULL,                   1, '15:30'),
  ('Almonds',                    'snack',     160,  6,  6, 14,  28, 'Handful',              1, '15:30'),
  ('Beef stir fry + noodles',    'dinner',    650, 45, 60, 20, 400, NULL,                   1, '20:00'),

  -- 2 days ago
  ('Protein pancakes',           'breakfast', 450, 35, 45, 10, 200, '3 pancakes',           2, '08:00'),
  ('Coffee with milk',           'breakfast',  60,  3,  6, 2,  200, NULL,                   2, '08:00'),
  ('Grilled chicken salad',      'lunch',     380, 40, 20, 14, 350, NULL,                   2, '12:00'),
  ('Brown rice + lentils',       'lunch',     420, 18, 72, 4,  300, NULL,                   2, '12:00'),
  ('Cottage cheese',             'snack',     150, 20,  6, 4,  200, NULL,                   2, '16:30'),
  ('Pasta bolognese',            'dinner',    680, 38, 80, 20, 450, 'Homemade sauce',       2, '19:00'),

  -- 3 days ago
  ('Avocado toast + eggs',       'breakfast', 510, 22, 38, 28, 250, '2 eggs poached',       3, '07:30'),
  ('Turkey sandwich',            'lunch',     430, 32, 42, 12, 280, 'Wholegrain bread',     3, '13:00'),
  ('Banana + peanut butter',     'snack',     280,  8, 35, 12, 100, NULL,                   3, '16:00'),
  ('Grilled sea bass + quinoa',  'dinner',    560, 44, 48, 16, 380, NULL,                   3, '19:30'),

  -- 4 days ago
  ('Muesli with milk',           'breakfast', 390, 14, 60, 9,  200, NULL,                   4, '07:45'),
  ('Chicken wrap',               'lunch',     480, 36, 46, 14, 300, NULL,                   4, '12:30'),
  ('Protein bar',                'snack',     220, 20, 22, 7,   60, NULL,                   4, '15:00'),
  ('Pork tenderloin + veggies',  'dinner',    530, 46, 30, 18, 350, NULL,                   4, '20:00')
) AS d(food_item, meal_type, calories, protein_g, carbs_g, fat_g, serving_g, note, days_ago, meal_time);