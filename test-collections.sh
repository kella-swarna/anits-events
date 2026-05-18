#!/bin/bash

echo "🧪 Testing Separate Collections Setup"
echo "====================================="
echo ""

echo "📝 Step 1: Upload a test coding event..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/events/upload-event \
  -F "eventName=Test Coding Event - Collection Test" \
  -F "eventDescription=Testing if this goes to codingevents collection" \
  -F "type=coding" \
  -F "uploader=Admin" \
  -F "eventDate=2025-10-20")

echo "Response: $RESPONSE"
echo ""

if echo "$RESPONSE" | grep -q "success.*true"; then
    echo "✅ Event uploaded successfully!"
    EVENT_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "Event ID: $EVENT_ID"
else
    echo "❌ Upload failed!"
    echo "Response: $RESPONSE"
    exit 1
fi

echo ""
echo "📊 Step 2: Checking which collection has the event..."
echo ""

echo "Querying coding events:"
curl -s "http://localhost:5000/api/events?type=coding" | python -m json.tool | grep -A5 "Test Coding Event - Collection Test" | head -10

echo ""
echo "====================================="
echo "✅ Test Complete!"
echo ""
echo "Next steps:"
echo "1. Check your MongoDB Atlas/Compass"
echo "2. Look for these collections:"
echo "   - codingevents"
echo "   - noncodingevents"
echo "   - nonanitsevents"
echo "3. The new event should be in 'codingevents'"
