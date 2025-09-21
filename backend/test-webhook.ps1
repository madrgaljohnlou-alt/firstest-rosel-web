# PowerShell script for testing webhooks
# Run with: .\test-webhook.ps1

Write-Host "🧪 Testing webhook endpoints..." -ForegroundColor Green
Write-Host ""

# Test data
$testData = @{
    apiKey = "pk_test_c68358d847953299e2993899f2370dbc"
    timestamp = [int][double]::Parse((Get-Date -UFormat %s))
    signature = "test_signature_123"
    eventId = "TEST_EVENT_ID_123"
    eventType = "ORDER_STATUS_CHANGED"
    eventVersion = "v3"
    data = @{
        order = @{
            orderId = "3316227378875113563"
            scheduleAt = "2025-09-10T19:00.00Z"
            shareLink = "https://share.sandbox.lalamove.com?PH100250910190105872520010059483757&lang=en_PH&sign=f44bb3cf37bf64cd56753cd6327bbee0&source=api_wrapper"
            market = "PH_MNL"
            createdAt = "2025-09-10T19:01.00Z"
            driverId = "80557"
            previousStatus = "PICKED_UP"
            status = "COMPLETED"
        }
        updatedAt = "2025-09-10T19:02.00Z"
    }
} | ConvertTo-Json -Depth 10

$headers = @{
    "Content-Type" = "application/json"
}

try {
    # Test 1: Debug endpoint
    Write-Host "1. Testing debug endpoint..." -ForegroundColor Yellow
    $debugResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/webhooks/debug" -Method POST -Body '{"test": "data"}' -Headers $headers
    Write-Host "✅ Debug endpoint response:" -ForegroundColor Green
    $debugResponse | ConvertTo-Json -Depth 5
    Write-Host ""

    # Test 2: Test endpoint
    Write-Host "2. Testing test endpoint..." -ForegroundColor Yellow
    $testResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/webhooks/test" -Method POST -Body '{"message": "test"}' -Headers $headers
    Write-Host "✅ Test endpoint response:" -ForegroundColor Green
    $testResponse | ConvertTo-Json -Depth 5
    Write-Host ""

    # Test 3: Simulate webhook
    Write-Host "3. Testing simulate endpoint..." -ForegroundColor Yellow
    $simulateData = @{
        eventType = "ORDER_STATUS_CHANGED"
        orderId = "test123"
        status = "COMPLETED"
    } | ConvertTo-Json
    $simulateResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/webhooks/simulate" -Method POST -Body $simulateData -Headers $headers
    Write-Host "✅ Simulate endpoint response:" -ForegroundColor Green
    $simulateResponse | ConvertTo-Json -Depth 5
    Write-Host ""

    # Test 4: Actual webhook endpoint
    Write-Host "4. Testing actual webhook endpoint..." -ForegroundColor Yellow
    $webhookResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/webhooks/lalamove" -Method POST -Body $testData -Headers $headers
    Write-Host "✅ Webhook endpoint response:" -ForegroundColor Green
    $webhookResponse | ConvertTo-Json -Depth 5
    Write-Host ""

    Write-Host "🎉 All tests passed!" -ForegroundColor Green

} catch {
    Write-Host "❌ Test failed:" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}
