$filePath = "src\app\pages\DashboardPage.tsx"
[string[]]$lines = @(Get-Content $filePath)
[System.Collections.ArrayList]$output = @()
$i = 0

while($i -lt $lines.Count) {
    $line = $lines[$i]
    
    # Check if this is the start of a Card we want to remove
    $removeCard = $false
    
    # Look ahead for the title to see if this is one of our three cards
    if($line -like '*<Card*') {
        # Look at the next 10 lines to find the card type
        for($j = $i; $j -lt [Math]::Min($i + 15, $lines.Count); $j++) {
            if($lines[$j] -like '*Habit Tracker*' -or 
               $lines[$j] -like '*Journal Preview*' -or 
               $lines[$j] -like '*Sleep Wellness*') {
                $removeCard = $true
                break
            }
        }
    }
    
    if($removeCard) {
        # Skip the entire Card element
        $cardDepth = 0
        $startLine = $i
        while($i -lt $lines.Count) {
            if($lines[$i] -match '<Card\b') { $cardDepth++ }
            if($lines[$i] -match '</Card>') { 
                $cardDepth--
                if($cardDepth -eq 0) {
                    # Skip the trailing newline after </Card>
                    $i++
                    break
                }
            }
            $i++
        }
        # Skip any empty lines after the card
        while($i -lt $lines.Count -and [string]::IsNullOrWhiteSpace($lines[$i])) {
            $i++
        }
    } else {
        $output.Add($line) | Out-Null
        $i++
    }
}

# Write back
$output | Set-Content $filePath
Write-Host "Successfully removed three cards! Total lines now: $($output.Count)"
