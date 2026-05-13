$filePath = "src\app\pages\DashboardPage.tsx"
$lines = @(Get-Content $filePath)
$output = @()
$skip = 0

for($i = 0; $i -lt $lines.Count; $i++) {
    if($skip -gt 0) {
        $skip--
        continue
    }
    
    $line = $lines[$i]
    
    # Check for Habit Tracker
    if($line -like "*Habit Tracker*") {
        # Skip lines until </Card> for this card
        $j = $i
        $cardDepth = 0
        while($j -lt $lines.Count) {
            if($lines[$j] -like "*<Card*") { $cardDepth++ }
            if($lines[$j] -like "*</Card>*") { 
                $cardDepth--
                if($cardDepth -eq 0) {
                    $skip = $j - $i
                    break
                }
            }
            $j++
        }
        continue
    }
    
    # Check for Journal Preview
    if($line -like "*Journal Preview*") {
        $j = $i
        $cardDepth = 0
        while($j -lt $lines.Count) {
            if($lines[$j] -like "*<Card*") { $cardDepth++ }
            if($lines[$j] -like "*</Card>*") { 
                $cardDepth--
                if($cardDepth -eq 0) {
                    $skip = $j - $i
                    break
                }
            }
            $j++
        }
        continue
    }
    
    # Check for Sleep Wellness
    if($line -like "*Sleep Wellness*") {
        $j = $i
        $cardDepth = 0
        while($j -lt $lines.Count) {
            if($lines[$j] -like "*<Card*") { $cardDepth++ }
            if($lines[$j] -like "*</Card>*") { 
                $cardDepth--
                if($cardDepth -eq 0) {
                    $skip = $j - $i
                    break
                }
            }
            $j++
        }
        continue
    }
    
    $output += $line
}

$output | Set-Content $filePath
Write-Host "File processed successfully"
