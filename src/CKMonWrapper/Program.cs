using CK.Core;
using CK.Monitoring;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;

namespace CKMonWrapper
{
	internal class Program
	{
		private static void Main(string[] args)
		{
			string inputFilePath = args[0];
			if( !Path.HasExtension(inputFilePath))
			{
				using(MultiLogReader multiLogReader = new MultiLogReader() )
				{
					multiLogReader.Add( Directory.GetFiles(inputFilePath, "*.ckmon", SearchOption.AllDirectories ) );

					var activityMap = multiLogReader.GetActivityMap();
					SortedList<DateTimeStamp, IMulticastLogEntry> list = new SortedList<DateTimeStamp, IMulticastLogEntry>();
					foreach( var file in activityMap.ValidFiles )
					{
						var readers = file.Monitors.Select( m => m.CreateFilteredReader(0L));
						foreach( var reader in readers )
						{
							while(reader.MoveNext())
							{
								list.Add( reader.CurrentMulticast.LogTime, reader.CurrentMulticast );
							}
						}
					}

					MulticastLogEntryTextBuilder b = new MulticastLogEntryTextBuilder();
					foreach( var entry in list )
					{
						b.AppendEntry(entry.Value);
					}
					Console.Out.Write(b.ToString());
				}
			}

			if( inputFilePath.EndsWith(".ckmon"))
			{
				MulticastLogEntryTextBuilder b = new MulticastLogEntryTextBuilder();
				CopyTo( b, inputFilePath );
			}
		}

        private static void CopyTo(MulticastLogEntryTextBuilder b, string filePath)
        {
           using (LogReader r = LogReader.Open(filePath, 0L, null))
			{
				
				var o = Console.Out;
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
