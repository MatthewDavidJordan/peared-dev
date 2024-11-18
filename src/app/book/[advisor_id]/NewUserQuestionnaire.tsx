import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

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
  const gradYears = getNextGraduationYears();

  const [major, setMajor] = useState('');
  const [highSchool, setHighSchool] = useState('');
  const [gradYear, setGradYear] = useState(gradYears[0]?.toString());
  const [extracurriculars, setExtracurriculars] = useState('');
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
        </div>
      </div>
    </div>
  );
}
