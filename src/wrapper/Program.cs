using CK.Monitoring;
using System;
using System.Diagnostics;
using System.IO;

namespace CKMonWrapper
{
	internal class Program
	{
		private static void Main(string[] args)
		{
			string inputFilePath = args[0];
            
			string outputFilePath = inputFilePath + ".txt";
			if (!File.Exists(outputFilePath))
			{
				MulticastLogEntryTextBuilder b = new MulticastLogEntryTextBuilder();
				using (LogReader r = LogReader.Open(inputFilePath, 0L, null))
				{
					using (StreamWriter o = new StreamWriter(outputFilePath))
					{
						int i = 0;
						while (r.MoveNext())
						{
							b.AppendEntry(r.CurrentMulticast);
							if (i++ == 20)
							{
								o.Write(b.Builder.ToString());
								b.Builder.Clear();
								i = 0;
							}
						}
						o.Write(b.Builder.ToString());
					}
				}
			}
		}
	}
}
