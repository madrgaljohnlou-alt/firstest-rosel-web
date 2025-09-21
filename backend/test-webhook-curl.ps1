# PowerShell script using curl for testing webhooks
# Run with: .\test-webhook-curl.ps1

Write-Host "🧪 Testing webhook endpoints with curl..." -ForegroundColor Green
Write-Host ""

# Test data
$testData = @'
{
    "apiKey": "pk_test_c68358d847953299e2993899f2370dbc",
    "timestamp": 1757502126,
    "signature": "test_signature_123",
    "eventId": "TEST_EVENT_ID_123",
    "eventType": "ORDER_STATUS_CHANGED",
    "eventVersion": "v3",
    "data": {
        "order": {
            "orderId": "3316227378875113563",
            "scheduleAt": "2025-09-10T19:00.00Z",
            "shareLink": "https://share.sandbox.lalamove.com?PH100250910190105872520010059483757&lang=en_PH&sign=f44bb3cf37bf64cd56753cd6327bbee0&source=api_wrapper",
            "market": "PH_MNL",
            "createdAt": "2025-09-10T19:01.00Z",
            "driverId": "80557",
            "previousStatus": "PICKED_UP",
            "status": "COMPLETED"
        },
        "updatedAt": "2025-09-10T19:02.00Z"
    }
}
'@

try {
    # Test 1: Debug endpoint
    Write-Host "1. Testing debug endpoint..." -ForegroundColor Yellow
    $debugResult = curl.exe -X POST http://localhost:5000/api/webhooks/debug -H "Content-Type: application/json" -d '{"test": "data"}'
    Write-Host "✅ Debug endpoint response:" -ForegroundColor Green
    Write-Host $debugResult
    Write-Host ""

    # Test 2: Test endpoint
    Write-Host "2. Testing test endpoint..." -ForegroundColor Yellow
    $testResult = curl.exe -X POST http://localhost:5000/api/webhooks/test -H "Content-Type: application/json" -d '{"message": "test"}'
    Write-Host "✅ Test endpoint response:" -ForegroundColor Green
    Write-Host $testResult
    Write-Host ""

    # Test 3: Simulate webhook
    Write-Host "3. Testing simulate endpoint..." -ForegroundColor Yellow
    $simulateData = @'
{
    "eventType": "ORDER_STATUS_CHANGED",
    "orderId": "test123",
    "status": "COMPLETED"
}
'@
    $simulateResult = curl.exe -X POST http://localhost:5000/api/webhooks/simulate -H "Content-Type: application/json" -d $simulateData
    Write-Host "✅ Simulate endpoint response:" -ForegroundColor Green
    Write-Host $simulateResult
    Write-Host ""

    # Test 4: Actual webhook endpoint
    Write-Host "4. Testing actual webhook endpoint..." -ForegroundColor Yellow
    $webhookResult = curl.exe -X POST http://localhost:5000/api/webhooks/lalamove -H "Content-Type: application/json" -d $testData
    Write-Host "✅ Webhook endpoint response:" -ForegroundColor Green
    Write-Host $webhookResult
    Write-Host ""

    Write-Host "🎉 All tests completed!" -ForegroundColor Green

} catch {
    Write-Host "❌ Test failed:" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
