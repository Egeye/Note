function checkIsCorrectDate(intYear, intMonth, intDay)
{
	let boolLeapYear;
	if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay)) return false;
	if (intMonth > 12 || intMonth < 1) return false;
	if ((intMonth == 1
	|| intMonth == 3
	|| intMonth == 5
	|| intMonth == 7
	|| intMonth == 8
	|| intMonth == 10
	|| intMonth == 12) && (intDay > 31 || intDay < 1)) return false;
	if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) && (intDay > 30 || intDay < 1)) return false;
	if (intMonth == 2)
	{
		if (intDay < 1) return false;
		boolLeapYear = false;

		if ((intYear % 100) == 0)
		{
			if ((intYear % 400) == 0) boolLeapYear = true;
		}
		else
		{
			if ((intYear % 4) == 0) boolLeapYear = true;
		}

		if (boolLeapYear)
		{
			if (intDay > 29) return false;
		}
		else
		{
			if (intDay > 28) return false;
		}
	}
	return true;
}
