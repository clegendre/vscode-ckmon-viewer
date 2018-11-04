using System;
using CK.Text;

namespace CKMonWrapperTest
{
	internal class Program
	{
		private static void Main(string[] args)
		{
            var s = args.Concatenate();
            Console.Out.Write(s);
        }
    }
}