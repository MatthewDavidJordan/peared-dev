import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/hooks/useAuth';
import { createSupabaseClient } from '@/lib/supabase';
import { useCallback, useState } from 'react';

function getNextGraduationYears() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // January is 0, so June is 5
  const startYear = currentMonth >= 6 ? currentYear + 1 : currentYear;
  const graduationYears = [];

  for (let i = 0; i < 4; i++) {
    graduationYears.push(startYear + i);
  }

  return graduationYears;
}

export default function NewUserQuestionnaire() {
  const supabase = createSupabaseClient();
  const { student, fetchStudent } = useAuth();

  const gradYears = getNextGraduationYears();

  const [major, setMajor] = useState('');
  const [highSchool, setHighSchool] = useState('');
  const [gradYear, setGradYear] = useState(gradYears[0]?.toString());
  const [extracurriculars, setExtracurriculars] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const submit = useCallback(async () => {
    if (!student) throw new Error('Student not found');

    setIsLoading(true);
    const res = await supabase
      .from('students')
      .update({
        major,
        high_school: highSchool,
        graduation_year: Number(gradYear) || undefined,
        extracurriculars,
        completed_sign_up_form: true,
      })
      .eq('student_id', student.student_id);
    await fetchStudent();
    setIsLoading(false);
  }, [extracurriculars, fetchStudent, gradYear, highSchool, major, student, supabase]);
  return (
    <div className="lg:!w-96">
      <div className="lg:!min-h-96">
        <div className="flex h-full flex-col gap-5 px-5 py-4 *:space-y-1.5">
          <div>
            <label>Name of high school</label>
            <Input
              placeholder="Palo Alto High School"
              value={highSchool}
              onChange={(e) => setHighSchool(e.target.value)}
            />
          </div>

          <div>
            <label>Grad year</label>
            <Select value={gradYear} onValueChange={setGradYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gradYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label>Intended major</label>
            <Input
              placeholder="Computer Science"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </div>

          <div>
            <label>Extracurriculars</label>
            <Input
              placeholder="Debate, Robotics, etc."
              value={extracurriculars}
              onChange={(e) => setExtracurriculars(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={submit}
              className="relative"
              disabled={isLoading}
              variant="primaryToAccent"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
