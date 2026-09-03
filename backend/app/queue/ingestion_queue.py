"""
Project Setu - Async Ingestion Queue Worker
Decouples complaint ingestion from synchronous downstream correlation & inference.
Enables honest non-blocking horizontal scaling design framing.
"""

import asyncio
from typing import Callable, Any, Dict

class IngestionQueueManager:
    def __init__(self):
        self.queue: asyncio.Queue = asyncio.Queue()
        self.is_running: bool = False
        self._worker_task = None
        self.processor_callback: Callable[[Dict[str, Any]], Any] = None

    def set_processor(self, callback: Callable[[Dict[str, Any]], Any]):
        self.processor_callback = callback

    async def enqueue(self, complaint: dict):
        await self.queue.put(complaint)

    async def start_worker(self):
        self.is_running = True
        self._worker_task = asyncio.create_task(self._worker_loop())

    async def _worker_loop(self):
        while self.is_running:
            try:
                complaint = await self.queue.get()
                if self.processor_callback:
                    if asyncio.iscoroutinefunction(self.processor_callback):
                        await self.processor_callback(complaint)
                    else:
                        self.processor_callback(complaint)
                self.queue.task_done()
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"Error processing complaint in queue worker: {e}")

    async def stop_worker(self):
        self.is_running = False
        if self._worker_task:
            self._worker_task.cancel()

global_queue_manager = IngestionQueueManager()
