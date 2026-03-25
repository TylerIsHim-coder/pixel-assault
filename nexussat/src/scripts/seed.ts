/**
 * NexusSAT Seed Script
 * Run: npm run db:seed
 *
 * Populates the database with:
 * - 1 demo user
 * - 3 sample folders
 * - 40 mock SAT practice questions (5 per category)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Helpers ────────────────────────────────────────────────────────────────

function choice(id: string, text: string) {
  return { id, text };
}

function q(
  category: string,
  section: "Math" | "Reading & Writing",
  difficulty: "easy" | "medium" | "hard",
  stem: string,
  choices: { id: string; text: string }[],
  correctId: string,
  explanation: string
) {
  return { category, section, difficulty, stem, choices: JSON.stringify(choices), correctId, explanation, source: "seed" };
}

// ─── Question bank ────────────────────────────────────────────────────────────

const QUESTIONS = [

  // ── Heart of Algebra ─────────────────────────────────────────────────────

  q("Heart of Algebra", "Math", "easy",
    "If 3x + 6 = 18, what is the value of x?",
    [choice("A","2"), choice("B","4"), choice("C","6"), choice("D","8")],
    "B",
    "**Why B is correct:** Subtract 6 from both sides → 3x = 12, then divide by 3 → x = 4.\n\n**Distractors:** A (divided 18 by 6 without subtracting first), C (forgot to divide by 3), D (arithmetic error).\n\n**Key takeaway:** Always isolate the variable in two clean steps: add/subtract constants, then multiply/divide."
  ),

  q("Heart of Algebra", "Math", "medium",
    "Which of the following equations has a graph that is a line passing through the origin with a slope of 3?\n\n**(A)** y = 3x + 1 &nbsp; **(B)** y = x + 3 &nbsp; **(C)** y = 3x &nbsp; **(D)** y = 3",
    [choice("A","y = 3x + 1"), choice("B","y = x + 3"), choice("C","y = 3x"), choice("D","y = 3")],
    "C",
    "**Why C is correct:** Slope-intercept form is y = mx + b. Slope m = 3, passes through origin means b = 0 → y = 3x.\n\n**Distractors:** A has slope 3 but y-intercept 1 (doesn't pass origin); B has slope 1; D is a horizontal line.\n\n**Key takeaway:** 'Through the origin' always means b = 0."
  ),

  q("Heart of Algebra", "Math", "medium",
    "If 2(3x − 4) = 4x + 6, what is the value of x?",
    [choice("A","1"), choice("B","3"), choice("C","5"), choice("D","7")],
    "D",
    "**Why D is correct:** Expand: 6x − 8 = 4x + 6 → 2x = 14 → x = 7.\n\n**Common mistake:** Forgetting to distribute the 2 to both terms inside the parentheses.\n\n**Key takeaway:** Always distribute fully before collecting like terms."
  ),

  q("Heart of Algebra", "Math", "hard",
    "A system of two linear equations has no solution. Which of the following must be true?\n\n**(A)** The lines are identical &nbsp; **(B)** The lines are perpendicular &nbsp; **(C)** The lines are parallel &nbsp; **(D)** The lines intersect at the y-axis",
    [choice("A","The lines are identical"), choice("B","The lines are perpendicular"), choice("C","The lines are parallel"), choice("D","The lines intersect at the y-axis")],
    "C",
    "**Why C is correct:** No solution means the lines never intersect, which happens when they are parallel (same slope, different y-intercepts).\n\n**Distractors:** A describes infinitely many solutions; B means one solution; D is still one intersection point.\n\n**Key takeaway:** No solution → parallel lines → same slope, different intercepts."
  ),

  q("Heart of Algebra", "Math", "hard",
    "If **ax + by = c** and **2ax + 2by = 6**, which of the following could be the value of c?\n\n**(A)** 1 &nbsp; **(B)** 2 &nbsp; **(C)** 3 &nbsp; **(D)** 5",
    [choice("A","1"), choice("B","2"), choice("C","3"), choice("D","5")],
    "C",
    "**Why C is correct:** Multiply the first equation by 2: 2ax + 2by = 2c. This equals 6, so 2c = 6 → c = 3.\n\n**Key takeaway:** When one equation is a scalar multiple of another, use that relationship to solve for constants."
  ),

  // ── Problem Solving & Data Analysis ──────────────────────────────────────

  q("Problem Solving & Data Analysis", "Math", "easy",
    "A bag contains 4 red marbles and 6 blue marbles. If one marble is chosen at random, what is the probability of choosing a red marble?",
    [choice("A","2/5"), choice("B","3/5"), choice("C","1/4"), choice("D","2/3")],
    "A",
    "**Why A is correct:** P(red) = 4 red / (4+6 total) = 4/10 = 2/5.\n\n**Key takeaway:** Probability = favorable outcomes / total outcomes."
  ),

  q("Problem Solving & Data Analysis", "Math", "medium",
    "A store sells a jacket for $80 after applying a 20% discount. What was the original price?",
    [choice("A","$96"), choice("B","$100"), choice("C","$104"), choice("D","$64")],
    "B",
    "**Why B is correct:** After 20% off, you pay 80% of the original. So 0.80 × P = 80 → P = 100.\n\n**Common mistake:** Adding 20% to $80 gives $96 (A) — this is wrong because the discount is off the original, not the sale price.\n\n**Key takeaway:** 'After x% discount' → divide sale price by (1 − x/100)."
  ),

  q("Problem Solving & Data Analysis", "Math", "medium",
    "The median of five numbers is 14. If four of the numbers are 8, 12, 16, and 20, what is the fifth number?",
    [choice("A","13"), choice("B","14"), choice("C","15"), choice("D","Any value between 12 and 16")],
    "B",
    "**Why B is correct:** When sorted, the median is the middle (3rd) value. With {8,12,14,16,20} the median is 14. The fifth number must be 14 — or any value that keeps 14 in the middle position.\n\n**Key takeaway:** For an odd count of numbers, median = the middle value when sorted."
  ),

  q("Problem Solving & Data Analysis", "Math", "hard",
    "A scatter plot shows a strong positive linear correlation between study hours (x) and test score (y). Which statement is best supported?",
    [choice("A","Studying more causes higher scores"), choice("B","Students who study more tend to score higher"), choice("C","Students who score higher tend to study more"), choice("D","B and C are both correct, but A is not")],
    "D",
    "**Why D is correct:** Correlation ≠ causation. The scatter plot shows association in both directions (B and C) but cannot establish that studying *causes* higher scores.\n\n**Key takeaway:** On SAT Data Analysis, never claim causation from a correlation-based graph."
  ),

  q("Problem Solving & Data Analysis", "Math", "hard",
    "A data set has a mean of 50 and a standard deviation of 5. If every value in the set is multiplied by 2, what are the new mean and standard deviation?",
    [choice("A","Mean = 100, SD = 5"), choice("B","Mean = 50, SD = 10"), choice("C","Mean = 100, SD = 10"), choice("D","Mean = 100, SD = 25")],
    "C",
    "**Why C is correct:** Multiplying all values by a constant k scales both the mean AND standard deviation by k. New mean = 50×2 = 100; new SD = 5×2 = 10.\n\n**Key takeaway:** Adding a constant shifts the mean but doesn't change SD; multiplying scales both."
  ),

  // ── Passport to Advanced Math ─────────────────────────────────────────────

  q("Passport to Advanced Math", "Math", "easy",
    "Which of the following is equivalent to (x + 3)²?",
    [choice("A","x² + 9"), choice("B","x² + 3x + 9"), choice("C","x² + 6x + 9"), choice("D","2x + 6")],
    "C",
    "**Why C is correct:** (x+3)² = x² + 2(x)(3) + 3² = x² + 6x + 9.\n\n**Common mistake:** Squaring only the individual terms (A) instead of using FOIL or the binomial formula.\n\n**Key takeaway:** (a+b)² = a² + 2ab + b²."
  ),

  q("Passport to Advanced Math", "Math", "medium",
    "If f(x) = 2x² − 3x + 1, what is f(−2)?",
    [choice("A","3"), choice("B","11"), choice("C","15"), choice("D","−9")],
    "C",
    "**Why C is correct:** f(−2) = 2(4) − 3(−2) + 1 = 8 + 6 + 1 = 15.\n\n**Common mistake:** Forgetting that (−2)² = +4, not −4.\n\n**Key takeaway:** Always square negative inputs before applying the coefficient."
  ),

  q("Passport to Advanced Math", "Math", "medium",
    "Which value of x satisfies x² − 5x + 6 = 0?",
    [choice("A","1 and 6"), choice("B","2 and 3"), choice("C","−2 and −3"), choice("D","−1 and 6")],
    "B",
    "**Why B is correct:** Factor: (x−2)(x−3) = 0 → x = 2 or x = 3.\n\n**Key takeaway:** To factor x² + bx + c, find two numbers that multiply to c and add to b."
  ),

  q("Passport to Advanced Math", "Math", "hard",
    "If g(x) = x³ − 4x, for how many values of x in the interval [−3, 3] does g(x) = 0?",
    [choice("A","1"), choice("B","2"), choice("C","3"), choice("D","4")],
    "C",
    "**Why C is correct:** g(x) = x(x²−4) = x(x−2)(x+2) = 0 → x = 0, 2, −2. All three are in [−3,3].\n\n**Key takeaway:** Always factor fully and check whether solutions fall in the given domain."
  ),

  q("Passport to Advanced Math", "Math", "hard",
    "The function h(t) = −16t² + 64t + 5 models the height (feet) of a ball at time t (seconds). What is the maximum height?",
    [choice("A","64 ft"), choice("B","69 ft"), choice("C","80 ft"), choice("D","128 ft")],
    "B",
    "**Why B is correct:** The vertex occurs at t = −b/2a = −64/(2·−16) = 2 s. h(2) = −16(4) + 64(2) + 5 = −64 + 128 + 5 = 69 ft.\n\n**Key takeaway:** For a quadratic ax²+bx+c, max/min is at x = −b/2a; always substitute back to find the y-value."
  ),

  // ── Additional Topics in Math ─────────────────────────────────────────────

  q("Additional Topics in Math", "Math", "easy",
    "In a right triangle, one leg is 6 and the hypotenuse is 10. What is the length of the other leg?",
    [choice("A","4"), choice("B","6"), choice("C","8"), choice("D","12")],
    "C",
    "**Why C is correct:** Pythagorean theorem: a² + b² = c² → 36 + b² = 100 → b² = 64 → b = 8.\n\n**Key takeaway:** Recognize the 6-8-10 as a 3-4-5 triple scaled by 2."
  ),

  q("Additional Topics in Math", "Math", "medium",
    "A circle has radius 5. What is the area of the circle?",
    [choice("A","10π"), choice("B","25π"), choice("C","50π"), choice("D","100π")],
    "B",
    "**Why B is correct:** Area = πr² = π(5²) = 25π.\n\n**Common mistake:** Using diameter instead of radius, or confusing area formula with circumference (2πr)."
  ),

  q("Additional Topics in Math", "Math", "medium",
    "If sin θ = 3/5 and θ is in the first quadrant, what is cos θ?",
    [choice("A","4/5"), choice("B","3/4"), choice("C","5/3"), choice("D","1/5")],
    "A",
    "**Why A is correct:** sin²θ + cos²θ = 1 → 9/25 + cos²θ = 1 → cos²θ = 16/25 → cos θ = 4/5 (positive in Q1).\n\n**Key takeaway:** Know the Pythagorean identity and the signs of trig functions in each quadrant (CAST)."
  ),

  q("Additional Topics in Math", "Math", "hard",
    "A regular hexagon has side length 4. What is its area?",
    [choice("A","24√3"), choice("B","48"), choice("C","16√3"), choice("D","24")],
    "A",
    "**Why A is correct:** Area of regular hexagon = (3√3/2)s² = (3√3/2)(16) = 24√3.\n\n**Key takeaway:** A regular hexagon can be split into 6 equilateral triangles. Each triangle has area (√3/4)s², so total = 6·(√3/4)·16 = 24√3."
  ),

  q("Additional Topics in Math", "Math", "hard",
    "In the complex plane, what is the modulus of 3 + 4i?",
    [choice("A","3"), choice("B","4"), choice("C","5"), choice("D","7")],
    "C",
    "**Why C is correct:** |a + bi| = √(a² + b²) = √(9 + 16) = √25 = 5.\n\n**Key takeaway:** The modulus of a complex number is the distance from the origin — same as the hypotenuse of a right triangle with legs a and b."
  ),

  // ── Information & Ideas ───────────────────────────────────────────────────

  q("Information & Ideas", "Reading & Writing", "easy",
    "The following sentence appears in a passage about climate change:\n\n*\"Rising sea levels have already begun to affect coastal communities, forcing some residents to relocate.\"*\n\nWhat is the primary purpose of this sentence?\n\n**(A)** To argue that climate change is man-made &nbsp; **(B)** To provide evidence of climate change's real-world impact &nbsp; **(C)** To suggest that all coastal residents will relocate &nbsp; **(D)** To explain the science behind rising sea levels",
    [choice("A","To argue that climate change is man-made"), choice("B","To provide evidence of climate change's real-world impact"), choice("C","To suggest that all coastal residents will relocate"), choice("D","To explain the science behind rising sea levels")],
    "B",
    "**Why B is correct:** The sentence provides a specific, concrete consequence (residents relocating) as evidence that sea level rise is already having real effects.\n\n**Distractors:** A is not stated; C overgeneralizes 'some residents'; D explains effects, not science.\n\n**Key takeaway:** 'Primary purpose' questions require identifying what the sentence *does* functionally, not just what it says."
  ),

  q("Information & Ideas", "Reading & Writing", "medium",
    "A researcher concludes: *\"Because students who eat breakfast score higher on tests, eating breakfast causes better academic performance.\"*\n\nWhich of the following best identifies the flaw in this reasoning?",
    [choice("A","The sample size is too small"), choice("B","Correlation does not establish causation"), choice("C","The researcher ignores after-school activities"), choice("D","Test scores are not a valid measure of performance")],
    "B",
    "**Why B is correct:** The researcher observes a correlation (breakfast → high scores) and claims causation without eliminating alternative explanations (e.g., socioeconomic factors).\n\n**Key takeaway:** Classic SAT reasoning flaw: correlation ≠ causation. Look for conclusions that go beyond what data can support."
  ),

  q("Information & Ideas", "Reading & Writing", "medium",
    "Which choice provides the most specific evidence to support the claim that urban green spaces improve mental health?",
    [choice("A","Many people enjoy spending time in parks"), choice("B","A 2021 study found that residents living near parks reported 18% lower anxiety levels"), choice("C","Green spaces are becoming more common in cities"), choice("D","Mental health is an important issue in modern society")],
    "B",
    "**Why B is correct:** Specific evidence requires a quantifiable result from a credible source. Only B provides a specific statistic from a named study.\n\n**Key takeaway:** For 'best evidence' questions, prefer specific data over general statements."
  ),

  q("Information & Ideas", "Reading & Writing", "hard",
    "A passage argues that remote work increases productivity. A student wants to weaken this argument. Which finding would most effectively do so?",
    [choice("A","Some employees prefer working from home"), choice("B","Office buildings are expensive to maintain"), choice("C","A longitudinal study found remote workers reported higher job satisfaction but produced fewer completed projects over time"), choice("D","Remote work technology has improved significantly")],
    "C",
    "**Why C is correct:** The claim is about *productivity* (output). C directly contradicts this with data showing fewer completed projects, which is a concrete measure of productivity.\n\n**Key takeaway:** To weaken an argument, find evidence that directly contradicts the *specific claim* being made."
  ),

  q("Information & Ideas", "Reading & Writing", "hard",
    "Two authors discuss automation's economic impact. Author 1 argues it creates new job categories; Author 2 argues it permanently displaces low-skill workers. Which approach would best help reconcile their views?",
    [choice("A","Dismiss Author 2's concerns as overstated"), choice("B","Analyze whether new jobs require skills accessible to displaced workers"), choice("C","Focus only on long-term economic growth data"), choice("D","Survey workers about their feelings toward automation")],
    "B",
    "**Why B is correct:** The core tension is whether new jobs *replace* the lost ones for the same workers. B directly addresses this gap by examining skill accessibility.\n\n**Key takeaway:** Reconciliation questions ask you to find the bridge between two positions — look for what each side assumes the other ignores."
  ),

  // ── Craft & Structure ─────────────────────────────────────────────────────

  q("Craft & Structure", "Reading & Writing", "easy",
    "As used in the passage, the word *\"ephemeral\"* most nearly means:\n\n**(A)** long-lasting &nbsp; **(B)** brief and fleeting &nbsp; **(C)** vivid and colorful &nbsp; **(D)** complex and difficult",
    [choice("A","long-lasting"), choice("B","brief and fleeting"), choice("C","vivid and colorful"), choice("D","complex and difficult")],
    "B",
    "**Why B is correct:** 'Ephemeral' means lasting for a very short time. Context clues in SAT passages typically reinforce this meaning.\n\n**Key takeaway:** For vocabulary-in-context, eliminate antonyms first (A = long-lasting is the opposite). Then substitute remaining choices back into the sentence."
  ),

  q("Craft & Structure", "Reading & Writing", "medium",
    "A student wants to transition from a paragraph about the causes of inflation to a paragraph about its effects on consumers. Which sentence best serves as a transition?",
    [choice("A","Inflation has many causes."), choice("B","Economists have debated this issue for decades."), choice("C","These inflationary pressures ultimately translate into real hardships for everyday shoppers."), choice("D","The Federal Reserve plays an important role in the economy.")],
    "C",
    "**Why C is correct:** C looks backward ('these inflationary pressures') to acknowledge the causes paragraph, then pivots forward ('translate into...hardships') to introduce consumer effects.\n\n**Key takeaway:** A good transition sentence has one foot in the previous idea and one in the next."
  ),

  q("Craft & Structure", "Reading & Writing", "medium",
    "The author uses the phrase *\"ticking time bomb\"* when describing rising national debt. This phrase is most likely intended to:\n\n**(A)** provide a literal description of the debt &nbsp; **(B)** create a sense of urgency about an impending crisis &nbsp; **(C)** suggest that the debt will explode soon &nbsp; **(D)** compare economists to bomb-disposal experts",
    [choice("A","provide a literal description of the debt"), choice("B","create a sense of urgency about an impending crisis"), choice("C","suggest that the debt will explode soon"), choice("D","compare economists to bomb-disposal experts")],
    "B",
    "**Why B is correct:** 'Ticking time bomb' is a metaphor conveying urgency and danger. The author's purpose is rhetorical — to alarm readers about inaction.\n\n**Key takeaway:** When analyzing figurative language, ask: what *effect* is the author trying to create?"
  ),

  q("Craft & Structure", "Reading & Writing", "hard",
    "The overall structure of the passage moves from:\n\n**(A)** problem → solution → counterargument → rebuttal\n**(B)** historical background → current debate → proposed solution\n**(C)** anecdote → general principle → supporting evidence → conclusion\n**(D)** definition → example → counterexample → synthesis",
    [choice("A","problem → solution → counterargument → rebuttal"), choice("B","historical background → current debate → proposed solution"), choice("C","anecdote → general principle → supporting evidence → conclusion"), choice("D","definition → example → counterexample → synthesis")],
    "C",
    "**Why C is correct (example answer):** Many SAT passages open with a specific story (anecdote), broaden to a general claim, then marshal evidence, and close with a takeaway. Always map the passage's actual structure.\n\n**Key takeaway:** For structure questions, quickly label each paragraph's function before reading the answer choices."
  ),

  q("Craft & Structure", "Reading & Writing", "hard",
    "The author's tone in the final paragraph can best be described as:\n\n**(A)** dismissive and contemptuous &nbsp; **(B)** cautiously optimistic &nbsp; **(C)** detached and scientific &nbsp; **(D)** bitterly sarcastic",
    [choice("A","dismissive and contemptuous"), choice("B","cautiously optimistic"), choice("C","detached and scientific"), choice("D","bitterly sarcastic")],
    "B",
    "**Why B is correct (example answer):** Final paragraphs that acknowledge challenges while expressing hope for solutions signal cautious optimism.\n\n**Key takeaway:** Tone is revealed by *word choice* and *what the author chooses to emphasize*. Look for hedging language ('may,' 'could,' 'if') for 'cautious'; positive outcomes for 'optimistic.'"
  ),

  // ── Expression of Ideas ───────────────────────────────────────────────────

  q("Expression of Ideas", "Reading & Writing", "easy",
    "Which choice best combines the following two sentences?\n\n*Sentence 1: The experiment failed. Sentence 2: The researchers learned valuable lessons from it.*\n\n**(A)** The experiment failed, the researchers learned valuable lessons.\n**(B)** Although the experiment failed, the researchers learned valuable lessons from it.\n**(C)** The experiment failed and also the researchers learned valuable lessons.\n**(D)** The experiment failed; additionally the researchers learned valuable lessons.",
    [choice("A","The experiment failed, the researchers learned valuable lessons."), choice("B","Although the experiment failed, the researchers learned valuable lessons from it."), choice("C","The experiment failed and also the researchers learned valuable lessons."), choice("D","The experiment failed; additionally the researchers learned valuable lessons.")],
    "B",
    "**Why B is correct:** 'Although' correctly signals the contrast between failure and learning. A is a comma splice. C is awkward and doesn't show contrast. D's 'additionally' implies addition, not contrast.\n\n**Key takeaway:** Choose conjunctions based on the *logical relationship* between ideas: contrast (although, however), addition (and, moreover), cause (because, so)."
  ),

  q("Expression of Ideas", "Reading & Writing", "medium",
    "A student is revising a report and wants to make this sentence more concise without losing meaning:\n\n*\"Due to the fact that the economy experienced a period of growth, unemployment rates fell significantly.\"*\n\nWhich revision is best?",
    [choice("A","Because the economy grew, unemployment fell significantly."), choice("B","The economy experienced growth, and because of this, unemployment rates fell."), choice("C","Unemployment fell, due to the fact that the economy grew significantly."), choice("D","Due to economic growth, unemployment rates fell, and this was significant.")],
    "A",
    "**Why A is correct:** 'Due to the fact that' is wordy; 'Because' is the concise replacement. 'Experienced a period of growth' → 'grew'. All meaning is preserved.\n\n**Key takeaway:** On SAT conciseness questions, eliminate redundant phrases: 'due to the fact that' = 'because'; 'in the event that' = 'if'; 'at this point in time' = 'now'."
  ),

  q("Expression of Ideas", "Reading & Writing", "medium",
    "Which sentence most effectively introduces the central argument of a paragraph about renewable energy's economic benefits?",
    [choice("A","Renewable energy is an interesting topic."), choice("B","Many countries have invested in solar panels."), choice("C","Beyond its environmental advantages, renewable energy now creates more jobs and generates greater economic output than fossil fuels in several key markets."), choice("D","Some people think renewable energy is good for the economy.")],
    "C",
    "**Why C is correct:** An effective topic sentence names the *specific claim* (economic benefits: jobs, output) and frames it precisely. A and D are vague; B is a fact without a claim.\n\n**Key takeaway:** A strong introductory sentence makes a specific, arguable claim — not a fact or vague observation."
  ),

  q("Expression of Ideas", "Reading & Writing", "hard",
    "The following sentence contains a dangling modifier. Which revision corrects it?\n\n*\"Running through the park, the flowers caught Maria's eye.\"*",
    [choice("A","Running through the park, Maria's eye was caught by the flowers."), choice("B","Maria, running through the park, caught the flowers with her eye."), choice("C","Running through the park, Maria noticed the flowers."), choice("D","The flowers, running through the park, caught Maria's eye.")],
    "C",
    "**Why C is correct:** The modifier 'running through the park' must immediately precede the noun doing the running — Maria. C correctly places Maria right after the comma.\n\n**Key takeaway:** Fix dangling modifiers by placing the noun being modified immediately after the participial phrase."
  ),

  q("Expression of Ideas", "Reading & Writing", "hard",
    "A writer wants to add a sentence to maintain the logical flow between these two sentences:\n\n*S1: \"The printing press revolutionized communication by making books widely available.\" S2: \"Literacy rates across Europe rose sharply over the following century.\"*\n\nWhich best fits between S1 and S2?",
    [choice("A","Books are important cultural artifacts."), choice("B","Johannes Gutenberg invented the printing press around 1440."), choice("C","As books became affordable, more people had the incentive and means to learn to read."), choice("D","Europe had many universities during this period.")],
    "C",
    "**Why C is correct:** C logically bridges 'books widely available' (S1) → 'more people learned to read' → 'literacy rose' (S2). It explains *how* the first event caused the second.\n\n**Key takeaway:** Bridging sentences must connect the *cause* in S1 to the *effect* in S2 with a clear logical link."
  ),

  // ── Standard English Conventions ──────────────────────────────────────────

  q("Standard English Conventions", "Reading & Writing", "easy",
    "Choose the correct punctuation:\n\n*\"The team won the championship __ everyone celebrated.\"*",
    [choice("A",", and"), choice("B","; however"), choice("C",": so"), choice("D","— although")],
    "A",
    "**Why A is correct:** Two independent clauses joined by 'and' require a comma before the coordinating conjunction (FANBOYS rule).\n\n**Key takeaway:** Comma + coordinating conjunction (for, and, nor, but, or, yet, so) correctly joins two independent clauses."
  ),

  q("Standard English Conventions", "Reading & Writing", "easy",
    "Which sentence uses the correct form of the verb?\n\n**(A)** Each of the students have submitted their essays.\n**(B)** Each of the students has submitted their essays.\n**(C)** Each of the students have submitted his essay.\n**(D)** Each of the students is submitting their essay.",
    [choice("A","Each of the students have submitted their essays."), choice("B","Each of the students has submitted their essays."), choice("C","Each of the students have submitted his essay."), choice("D","Each of the students is submitting their essay.")],
    "B",
    "**Why B is correct:** 'Each' is a singular indefinite pronoun → singular verb ('has'). 'Their' as a singular gender-neutral pronoun is accepted in modern usage.\n\n**Key takeaway:** Indefinite pronouns like each, every, anyone, someone → singular verb, regardless of the prepositional phrase that follows."
  ),

  q("Standard English Conventions", "Reading & Writing", "medium",
    "Which correctly uses a semicolon?\n\n**(A)** She studied hard; and passed the exam.\n**(B)** She studied hard; however, she still failed.\n**(C)** She; studied hard and passed.\n**(D)** She studied; hard for the exam.",
    [choice("A","She studied hard; and passed the exam."), choice("B","She studied hard; however, she still failed."), choice("C","She; studied hard and passed."), choice("D","She studied; hard for the exam.")],
    "B",
    "**Why B is correct:** A semicolon correctly joins two independent clauses. 'However' is a conjunctive adverb — semicolon before it, comma after.\n\n**A is wrong:** Don't use a semicolon before 'and' (a coordinating conjunction — use a comma instead).\n\n**Key takeaway:** Semicolons join two independent clauses, or come before conjunctive adverbs (however, therefore, moreover)."
  ),

  q("Standard English Conventions", "Reading & Writing", "medium",
    "Select the option that corrects the apostrophe error:\n\n*\"The committee made it's decision after reviewing the proposal.\"*",
    [choice("A","it's"), choice("B","its'"), choice("C","its"), choice("D","its's")],
    "C",
    "**Why C is correct:** 'Its' (no apostrophe) is the possessive pronoun. 'It's' = 'it is' — a contraction, not a possessive.\n\n**Key takeaway:** Possessive pronouns (its, his, hers, theirs, ours) NEVER have apostrophes. Apostrophes in pronouns signal contractions."
  ),

  q("Standard English Conventions", "Reading & Writing", "hard",
    "Which choice corrects the modifier placement error?\n\n*\"Having studied for weeks, the test seemed easy to the student.\"*",
    [choice("A","Having studied for weeks, the student found the test easy."), choice("B","The test, having studied for weeks, seemed easy."), choice("C","Having studied for weeks, easily the test was passed."), choice("D","The student, the test having been studied for, found it easy.")],
    "A",
    "**Why A is correct:** The participial phrase 'Having studied for weeks' must modify the student (the one who studied), so 'the student' must immediately follow the comma.\n\n**Key takeaway:** The subject of a participial phrase must be the grammatical subject of the main clause."
  ),
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding NexusSAT database…\n");

  // Demo user
  const user = await prisma.user.upsert({
    where: { id: "demo-user" },
    create: { id: "demo-user", email: "student@nexussat.app", name: "Student" },
    update: {},
  });
  console.log(`✓ User: ${user.email}`);

  // Folders
  const mathFolder = await prisma.folder.upsert({
    where: { id: "folder-math" },
    create: { id: "folder-math", name: "Math Notes", color: "#6366f1", userId: user.id },
    update: {},
  });
  const rwFolder = await prisma.folder.upsert({
    where: { id: "folder-rw" },
    create: { id: "folder-rw", name: "Reading & Writing", color: "#8b5cf6", userId: user.id },
    update: {},
  });
  const examFolder = await prisma.folder.upsert({
    where: { id: "folder-exam" },
    create: { id: "folder-exam", name: "Exam Prep", color: "#f59e0b", userId: user.id },
    update: {},
  });
  console.log(`✓ Folders: ${mathFolder.name}, ${rwFolder.name}, ${examFolder.name}`);

  // Sample notes
  await prisma.note.upsert({
    where: { id: "note-sample-1" },
    create: {
      id: "note-sample-1",
      title: "Heart of Algebra — Key Formulas",
      content: "## Key Concepts\n\n- **Slope-intercept form:** y = mx + b\n- **Standard form:** Ax + By = C\n- **Point-slope form:** y − y₁ = m(x − x₁)\n\n## Common Mistake\n\nAlways isolate the variable in two steps: add/subtract constants first, then multiply/divide.",
      isAiGen: false,
      userId: user.id,
      folderId: mathFolder.id,
    },
    update: {},
  });
  console.log(`✓ Sample note created`);

  // Questions
  await prisma.question.deleteMany({});
  const created = await prisma.question.createMany({ data: QUESTIONS });
  console.log(`✓ Questions: ${created.count} inserted`);

  console.log("\n✅ Seed complete! Run `npm run dev` to start the app.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
