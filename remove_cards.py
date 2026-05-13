import re

file_path = r"src\app\pages\DashboardPage.tsx"

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match and remove Habit Tracker card
habit_pattern = r'            <Card className="rounded-\[28px\] border border-white/70 bg-white/90 p-6 shadow-\[0_28px_90px_rgba\(15,23,42,0\.08\)\]">\s*<div className="flex items-start justify-between gap-4">\s*<div>\s*<p className="text-sm uppercase tracking-\[0\.32em\] text-slate-500">Habit Tracker</p>\s*<h3 className="mt-3 text-2xl font-semibold text-slate-950">Healthy habits</h3>\s*</div>\s*<Activity className="h-6 w-6 text-slate-600" />\s*</div>\s*<div className="mt-8 space-y-5">.*?{/\s*habitTracker\.map\(\(item\) => \(.*?\)\)\s*}\s*</div>\s*</Card>\s*\n\s*'
content = re.sub(habit_pattern, '', content, flags=re.DOTALL)

# Pattern to match and remove Journal Preview card
journal_pattern = r'<Card className="rounded-\[28px\] border border-white/70 bg-white/90 p-6 shadow-\[0_28px_90px_rgba\(15,23,42,0\.08\)\]">\s*<div className="flex items-start justify-between gap-4">\s*<div>\s*<p className="text-sm uppercase tracking-\[0\.32em\] text-slate-500">Journal Preview</p>\s*<h3 className="mt-3 text-2xl font-semibold text-slate-950">Today&apos;s reflection</h3>\s*</div>\s*<BookOpen className="h-6 w-6 text-slate-600" />\s*</div>\s*<div className="mt-8 rounded-\[28px\] border border-slate-200 bg-slate-50 p-5">.*?</div>\s*<Button onClick=\{\(\) => navigate\([\'"]\/mood[\'"]\)\} className="mt-6 w-full rounded-full bg-violet-600 text-white hover:bg-violet-700">Continue Writing</Button>\s*</Card>\s*\n\s*'
content = re.sub(journal_pattern, '', content, flags=re.DOTALL)

# Pattern to match and remove Sleep Wellness card
sleep_pattern = r'<Card className="rounded-\[28px\] border border-white/70 bg-white/90 p-6 shadow-\[0_28px_90px_rgba\(15,23,42,0\.08\)\]">\s*<div className="flex items-start justify-between gap-4">\s*<div>\s*<p className="text-sm uppercase tracking-\[0\.32em\] text-slate-500">Sleep Wellness</p>\s*<h3 className="mt-3 text-2xl font-semibold text-slate-950">Rest quality</h3>\s*</div>\s*<Moon className="h-6 w-6 text-slate-600" />\s*</div>\s*<div className="mt-8 space-y-5">.*?</div>\s*</Card>\s*\n\s*'
content = re.sub(sleep_pattern, '', content, flags=re.DOTALL)

# Write the file back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully removed three dashboard cards!")
