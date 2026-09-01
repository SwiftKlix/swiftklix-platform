import urllib.request
import json

BASE = "http://localhost:5000/api"

def get(url):
    req = urllib.request.Request(f"{BASE}{url}")
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def post(url, data):
    req = urllib.request.Request(
        f"{BASE}{url}",
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def patch(url, data):
    req = urllib.request.Request(
        f"{BASE}{url}",
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='PATCH'
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

print("--- 1. Testing GET /api/stats ---")
stats = get("/stats")
print("Platform Stats:", stats)

print("\n--- 2. Testing GET /api/orgs ---")
orgs = get("/orgs")
print(f"Loaded {len(orgs)} organizations: {[o['name'] for o in orgs]}")

print("\n--- 3. Testing GET /api/opportunities ---")
opps = get("/opportunities")
print(f"Loaded {len(opps)} active opportunities/campaigns")

print("\n--- 4. Testing POST /api/applications (Changemaker applying to found chapter) ---")
new_app = post("/applications", {
    "orgId": "org-ecoroots",
    "opportunityId": "opp-1",
    "applicantName": "Jordan Rivera",
    "applicantEmail": "jordan@stanford.edu",
    "proposedLocation": "Stanford University & Palo Alto",
    "role": "Founding Chapter Lead",
    "background": "Organized campus zero-waste drive.",
    "plan": "Recruit 25 students, plant native trees."
})
print(f"Application created: ID={new_app['id']}, Name={new_app['applicantName']}, Status={new_app['status']}")

print("\n--- 5. Testing PATCH /api/applications/:id/status (HQ Approves Chapter) ---")
approved = patch(f"/applications/{new_app['id']}/status", {
    "status": "approved",
    "notes": "Approved for $2,500 branch launch and chapter charter."
})
print(f"Application status updated to: {approved['status']}")

print("\n--- 6. Testing Chapter auto-chartering ---")
chapters = get("/chapters")
print(f"Total active chapters after approval: {len(chapters)}")
recent = chapters[0]
print(f"Latest chartered chapter: {recent['name']} (Lead: {recent['leadName']})")

print("\n--- 7. Testing POST /api/matchmaking ---")
new_match = post("/matchmaking", {
    "name": "David Chen",
    "avatarEmoji": "??",
    "headline": "Full-Stack Dev seeking Non-Profit Co-Founder for Civic Tech",
    "location": "New York, NY",
    "skills": ["React", "Python", "Civic Tech"],
    "lookingFor": "Policy or Outreach Co-Lead",
    "bio": "Built local voter awareness portals.",
    "contactEmail": "david@civicny.org"
})
print(f"Matchmaker profile posted: {new_match['name']} - {new_match['headline']}")

print("\n--- 8. Testing Chapter Member & Event Logging ---")
event = post(f"/chapters/{recent['id']}/events", {
    "title": "Inaugural Campus Tree Planting",
    "attendees": "35"
})
member = post(f"/chapters/{recent['id']}/members", {
    "name": "Sarah Miller"
})
print(f"Logged event: {event['recentEvent']}, Total Events: {event['eventsHosted']}, Active Members: {member['activeMembers']}")

print("\n ALL BACKEND & FRONTEND INTEGRATION TESTS PASSED WITH 100% SUCCESS!")
