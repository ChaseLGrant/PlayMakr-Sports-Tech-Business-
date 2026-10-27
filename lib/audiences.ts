/** Audience landing pages: /for/[slug]. Each has its own hook and offer. */

export type Audience = {
  slug: string;
  nav: string;
  orgType: string; // matches organizationTypes value, used to prefill /apply
  eyebrow: string;
  hook: string;
  hookAccent: string;
  sub: string;
  offerName: string;
  offerLine: string;
  leaks: { title: string; body: string }[];
  stack: string[];
  bonus: string;
  metaDescription: string;
};

export const audiences: Audience[] = [
  {
    slug: "leagues",
    nav: "Leagues & Associations",
    orgType: "league",
    eyebrow: "For leagues & associations",
    hook: "Fill Every Division",
    hookAccent: "Before Registration Closes.",
    sub: "Half-finished signups, late fees nobody chases and parents who never hear back are quietly costing your league players and money every season.",
    offerName: "Free League Revenue Leak Report",
    offerLine: "We'll show you exactly how many registrations and dollars your league lost last season, and the three fixes that win them back.",
    leaks: [
      { title: "Abandoned registrations", body: "Families start signing up, get distracted and never finish. Without an automatic nudge, those players just disappear." },
      { title: "Unpaid balances", body: "Volunteers chase payments by hand, so late fees slip and outstanding balances roll into next season." },
      { title: "Returning families who don't return", body: "Nobody reminds last year's players to come back before a rival league opens registration." },
    ],
    stack: [
      "Registration funnel review: where families drop off and why",
      "Unpaid balance and late-fee recovery estimate",
      "Returning-player reactivation plan for next season",
      "Software audit: what you can cut or connect",
      "A prioritized 90-day action plan",
    ],
    bonus: "Founding partners get their abandoned-registration recovery flow built custom and free for the first month.",
    metaDescription: "Free League Revenue Leak Report for youth and adult sports leagues. Find lost registrations and unpaid balances, and get them back.",
  },
  {
    slug: "camps",
    nav: "Camps",
    orgType: "camp_clinic",
    eyebrow: "For sports camps",
    hook: "Sell Out Summer Camp",
    hookAccent: "Before School Lets Out.",
    sub: "Every camp loses families to slow replies, clunky checkout and no follow-up. The camps that sell out first aren't better. They just never let a lead go cold.",
    offerName: "Free Camp Sell-Out Plan",
    offerLine: "We'll pinpoint how many campers you lost last summer, and hand you the plan to fill every session faster this year.",
    leaks: [
      { title: "Checkout drop-off", body: "Parents start registering on their phone and quit halfway. Those spots stay empty unless someone follows up fast." },
      { title: "Last summer's families", body: "Your easiest campers are the ones you already had. Most camps never send them an early-bird offer." },
      { title: "Waitlists that go nowhere", body: "When a spot opens, nobody gets offered it in time, so the session runs short." },
    ],
    stack: [
      "Registration and checkout teardown with fixes",
      "Early-bird and returning-camper campaign plan",
      "Waitlist auto-fill workflow design",
      "Pricing and add-on opportunities (extended day, gear, multi-week)",
      "A prioritized plan to sell out sooner",
    ],
    bonus: "Founding partners get their returning-camper early-bird campaign built custom and free for the first month.",
    metaDescription: "Free Camp Sell-Out Plan for sports camps. Recover lost registrations, re-book last summer's families and fill every session faster.",
  },
  {
    slug: "clinics",
    nav: "Clinics & Private Training",
    orgType: "camp_clinic",
    eyebrow: "For clinics & private training",
    hook: "Every Unanswered Inquiry",
    hookAccent: "Is a Lesson You Didn't Sell.",
    sub: "Parents message three trainers and book whoever answers first. If you reply hours later, you've already lost them.",
    offerName: "Free Booked-Calendar Blueprint",
    offerLine: "We'll show you how many sessions slipped through your inbox last month, and how to answer every inquiry in under a minute.",
    leaks: [
      { title: "Slow replies", body: "Inquiries sit in DMs, texts and email while you're on the field coaching. By the time you answer, they've booked elsewhere." },
      { title: "Open coach hours", body: "Unbooked time slots earn nothing, and you can't sell yesterday's hour." },
      { title: "One-and-done clients", body: "Athletes take a session or two and drift away without a package or a reminder to come back." },
    ],
    stack: [
      "Inquiry response audit across text, DMs, email and forms",
      "Instant-reply and booking workflow design",
      "Open-hours fill plan with automatic offers",
      "Package and membership pricing ideas",
      "A prioritized plan to fill your calendar",
    ],
    bonus: "Founding partners get their instant-reply booking assistant built custom and free for the first month.",
    metaDescription: "Free Booked-Calendar Blueprint for sports clinics and private trainers. Answer every inquiry fast and fill open coach hours.",
  },
  {
    slug: "universities",
    nav: "Universities & College Athletics",
    orgType: "university",
    eyebrow: "For universities & college athletics",
    hook: "New Revenue for Your Athletic Department,",
    hookAccent: "Without Adding Staff.",
    sub: "Camps, clinics, ticketing, sponsorships and donors all bring in money, and all of them run on overworked staff and disconnected tools.",
    offerName: "Free Athletics Revenue Opportunity Review",
    offerLine: "We'll map where your department is leaving camp, ticketing and donor revenue on the table, and what it takes to capture it.",
    leaks: [
      { title: "Camp and clinic revenue", body: "Coach-run camps live on separate sign-up pages with no follow-up, no early-bird offers and no data on who came back." },
      { title: "Fan and donor follow-up", body: "Ticket buyers and alumni get generic blasts instead of the right ask at the right time." },
      { title: "Staff buried in admin", body: "Coordinators spend hours on spreadsheets, forms and reconciliations that software can handle." },
    ],
    stack: [
      "Camp and clinic revenue review across programs",
      "Fan, ticketing and donor follow-up assessment",
      "Admin workflow and software overlap review",
      "Integration options with your current platforms",
      "A prioritized revenue roadmap for leadership",
    ],
    bonus: "Founding partners get one camp or clinic registration system rebuilt custom and free for the first month.",
    metaDescription: "Free Athletics Revenue Opportunity Review for universities and college athletic departments. Grow camp, ticketing and donor revenue.",
  },
  {
    slug: "facilities",
    nav: "Facilities & Complexes",
    orgType: "single_facility",
    eyebrow: "For facilities & sports complexes",
    hook: "Your Empty Courts and Fields",
    hookAccent: "Cost You Money Every Night.",
    sub: "An unbooked hour earns nothing and can never be sold again. Most facilities have teams who would take it, but nobody offered it in time.",
    offerName: "Free Empty-Hours Revenue Report",
    offerLine: "We'll estimate what your unbooked hours cost you last quarter, and how to fill them automatically.",
    leaks: [
      { title: "Unsold prime time", body: "Cancellations and gaps go unfilled because offering them takes a staff member's afternoon." },
      { title: "Rental inquiries that stall", body: "Teams ask about availability and wait days for a quote." },
      { title: "No view of utilization", body: "Without clear numbers, pricing and scheduling decisions are guesses." },
    ],
    stack: [
      "Utilization review by space, day and hour",
      "Open-slot auto-offer workflow to waitlisted teams",
      "Rental inquiry to booking speed audit",
      "Dynamic pricing and off-peak package ideas",
      "A prioritized plan to raise utilization",
    ],
    bonus: "Founding partners get their open-slot auto-offer system built custom and free for the first month.",
    metaDescription: "Free Empty-Hours Revenue Report for sports facilities and complexes. Fill unbooked courts, fields and cages automatically.",
  },
  {
    slug: "clubs",
    nav: "Clubs & Academies",
    orgType: "youth_club",
    eyebrow: "For clubs & academies",
    hook: "Win the Tryout Families",
    hookAccent: "Your Competitors Are Losing.",
    sub: "Tryout season decides your year. The clubs that follow up fastest and keep families informed sign the players, and keep them next season.",
    offerName: "Free Tryout-to-Roster Report",
    offerLine: "We'll show you where families fall out between tryout interest and a signed roster spot, and how to keep them.",
    leaks: [
      { title: "Tryout interest that cools", body: "Families sign up for info, then hear nothing until it's too late and they've committed elsewhere." },
      { title: "Re-enrollment drop-off", body: "Players leave between seasons without anyone asking why or making an offer to stay." },
      { title: "Directors stuck in admin", body: "Rosters, uniforms, payments and schedules eat the hours that should go to coaching and sales." },
    ],
    stack: [
      "Tryout funnel review from first inquiry to signed player",
      "Re-enrollment and retention plan",
      "Payment plan and collections review",
      "Director admin time and software overlap audit",
      "A prioritized plan for your next tryout season",
    ],
    bonus: "Founding partners get their tryout follow-up sequence built custom and free for the first month.",
    metaDescription: "Free Tryout-to-Roster Report for youth sports clubs and academies. Sign more tryout families and keep them next season.",
  },
  {
    slug: "tournaments",
    nav: "Tournaments & Showcases",
    orgType: "tournament",
    eyebrow: "For tournaments & showcases",
    hook: "Fill Your Brackets",
    hookAccent: "Weeks Earlier.",
    sub: "Teams that played last year are your easiest sale, but most events wait for them to remember. Early entries mean early cash and less stress.",
    offerName: "Free Bracket Fill Plan",
    offerLine: "We'll show you how many past teams didn't come back, and the outreach that fills your next event sooner.",
    leaks: [
      { title: "Past teams who don't return", body: "Last year's coaches never got a personal invite or an early-entry deal." },
      { title: "Entry checkout friction", body: "Coaches start an entry, hit a confusing form and put it off." },
      { title: "Event-week chaos", body: "Check-in, payments, schedules and changes all run through different tools and group texts." },
    ],
    stack: [
      "Past-team return rate and win-back plan",
      "Entry and payment checkout review",
      "Early-entry pricing and deadline strategy",
      "Event-week operations and communication audit",
      "A prioritized plan to fill your next event",
    ],
    bonus: "Founding partners get their past-team win-back campaign built custom and free for the first month.",
    metaDescription: "Free Bracket Fill Plan for sports tournaments and showcases. Bring back past teams and fill brackets weeks earlier.",
  },
];

export const getAudience = (slug: string) => audiences.find((a) => a.slug === slug);
