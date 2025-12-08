-- Create user_credits table
CREATE TABLE user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_credits
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_credits
CREATE POLICY "Users can view own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits"
  ON user_credits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credits"
  ON user_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create quizzes table
CREATE TABLE quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  credits_earned integer DEFAULT 10,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, title, DATE(created_at))
);

-- Enable RLS on quizzes
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes
CREATE POLICY "Users can view own quizzes"
  ON quizzes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quizzes"
  ON quizzes FOR UPDATE
  USING (auth.uid() = user_id);

-- Create quiz_questions table
CREATE TABLE quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_option integer NOT NULL,
  order_index integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on quiz_questions
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_questions
CREATE POLICY "Users can view quiz questions for their quizzes"
  ON quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes WHERE quizzes.id = quiz_questions.quiz_id AND quizzes.user_id = auth.uid()
    )
  );

-- Create quiz_answers table
CREATE TABLE quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  user_answer integer NOT NULL,
  is_correct boolean NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on quiz_answers
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_answers
CREATE POLICY "Users can view own answers"
  ON quiz_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes WHERE quizzes.id = quiz_answers.quiz_id AND quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own answers"
  ON quiz_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes WHERE quizzes.id = quiz_answers.quiz_id AND quizzes.user_id = auth.uid()
    )
  );
