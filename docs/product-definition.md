# Product Definition

## Platform
Kelajak Merosi is an educational platform with dual priorities:
- Student learning progression and mastery.
- Admin/operator visibility into system health and user activity.

## Primary Outcomes
- Students can reliably discover lessons, continue progress, and complete quizzes.
- Admins can access operational status and user-level summaries without ambiguity.

## User Groups
- Student: consumes lessons, tracks progress, completes quizzes.
- Admin: views system status and user summaries.
- Guest: can browse limited learning flow but is prompted to authenticate for persistence.

## Core Student Flows
1. Authenticate (or continue as guest).
2. Open dashboard for continuation recommendations.
3. Browse subjects and topics.
4. Watch lesson video, complete quiz, and persist progress.
5. Review profile progress summary.

## Core Admin Flows
1. Navigate to `/admin`.
2. Review runtime/system info.
3. Review user list summary.
4. Detect backend/API outages via explicit error states.

## UX Principles
- URL should represent page identity for deep links and browser history.
- Loading/empty/error states should be explicit for every data surface.
- Actions should be keyboard accessible and focus-visible.
- Visual style can remain glassmorphism-inspired, but readability and performance are mandatory.

## Non-Goals In Current Cycle
- Full backend migration to TypeScript.
- Full redesign or brand reset.
- Replacing current database layer with new ORM in this iteration.
